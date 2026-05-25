using System.Net;
using Microsoft.EntityFrameworkCore;
using QuizBackend.Common;
using QuizBackend.Data;
using QuizBackend.Models;

public class QuizService : IQuizService
{
    private readonly MyDbContext _context;

    public QuizService(MyDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<CreateQuizResponse>> CreateComplexQuizAsync(QuizRequest request, string userEmail)
    {
        var safeEmail = userEmail?.Trim().ToLower();
        // 1. Tìm Account dựa trên Email trích xuất từ Token
        var account = await _context.Accounts
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.Email == safeEmail && !a.IsDelete);
        
        if (account == null)
        {
            return new ApiResponse<CreateQuizResponse>
            {
                Success = false,
                Message = "Tai khoan khong ton tai",
                StatusCode = (int)HttpStatusCode.NotFound,
            };
        } 

        // 2. Bắt đầu Transaction (Bước 5 trong Sequence)
        using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            // 3. Khởi tạo Quiz (Bước 6)
            var quiz = new Quiz
            {
                Title = request.Title,
                Description = request.Description,
                AccountId = account.AccountId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Quizzes.Add(quiz);
            await _context.SaveChangesAsync(); // Lưu để lấy QuizId

            // 4. Lặp qua danh sách câu hỏi và đáp án (Bước 11)
            foreach (var qReq in request.Questions)
            {
                var question = new Question
                {
                    Content = qReq.Content,
                    Type = qReq.Type,
                    Score = qReq.Score,
                    QuizId = quiz.QuizId
                };
                _context.Questions.Add(question);
                await _context.SaveChangesAsync();

                var answers = qReq.Answers.Select(aReq => new Answer
                {
                    Content = aReq.Content,
                    IsCorrect = aReq.IsCorrect,
                    OrderIndex = aReq.OrderIndex,
                    QuestionId = question.QuestionId
                });

                _context.Answers.AddRange(answers);
            }

            await _context.SaveChangesAsync();

            // 5. Commit Transaction (Bước 13)
            await transaction.CommitAsync();

            return new ApiResponse<CreateQuizResponse>
            {
                Success = true,
                Message = "Tao quiz thanh cong",
                StatusCode = (int)HttpStatusCode.OK,
                Data = new CreateQuizResponse
                {
                    QuizId = quiz.QuizId
                }
            };
        }
        catch (Exception)
        {
            // 6. Rollback nếu có bất kỳ lỗi nào (Bước 8)
            await transaction.RollbackAsync();
            throw; // Re-throw để Controller xử lý trả về 500
        }
    }

    public async Task<ApiResponse<CreateQuizResponse>> UpdateComplexQuizAsync(int quizId, QuizRequest request, string userEmail)
    {
        var safeEmail = userEmail?.Trim().ToLower();

        // 1. Xác thực tài khoản
        var account = await _context.Accounts
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.Email == safeEmail && !a.IsDelete);

        if (account == null)
        {
            return new ApiResponse<CreateQuizResponse>
            {
                Success = false,
                Message = "Tai khoan khong ton tai",
                StatusCode = (int)HttpStatusCode.NotFound,
            };
        }

        // 2. Tìm bài Quiz cần sửa và kiểm tra quyền sở hữu (Bảo mật quan trọng!)
        var quiz = await _context.Quizzes
            .FirstOrDefaultAsync(q => q.QuizId == quizId && q.AccountId == account.AccountId);

        if (quiz == null)
        {
            return new ApiResponse<CreateQuizResponse>
            {
                Success = false,
                Message = "Quiz khong ton tai hoac ban khong co quyen chinh sua",
                StatusCode = (int)HttpStatusCode.NotFound,
            };
        }

        // 3. Bắt đầu Transaction để đảm bảo tính toàn vẹn trên TiDB
        using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            // 4. Cập nhật thông tin cơ bản của Quiz
            quiz.Title = request.Title;
            quiz.Description = request.Description;

            var oldQuestions = _context.Questions.Where(q => q.QuizId == quizId);
            _context.Questions.RemoveRange(oldQuestions);
            
            // Lưu thay đổi tạm thời để dọn đường cho dữ liệu mới
            await _context.SaveChangesAsync(); 

            // 6. Nạp lại danh sách câu hỏi và đáp án mới từ Request (Y hệt hàm Create)
            foreach (var qReq in request.Questions)
            {
                var question = new Question
                {
                    Content = qReq.Content,
                    Type = qReq.Type,
                    Score = qReq.Score,
                    QuizId = quiz.QuizId // Gắn vào Id của Quiz hiện tại
                };
                _context.Questions.Add(question);
                await _context.SaveChangesAsync(); // Lưu để lấy QuestionId mới

                var answers = qReq.Answers.Select(aReq => new Answer
                {
                    Content = aReq.Content,
                    IsCorrect = aReq.IsCorrect,
                    OrderIndex = aReq.OrderIndex,
                    QuestionId = question.QuestionId
                });

                _context.Answers.AddRange(answers);
            }

            await _context.SaveChangesAsync();

            // 7. Chốt dữ liệu
            await transaction.CommitAsync();

            return new ApiResponse<CreateQuizResponse>
            {
                Success = true,
                Message = "Cap nhat quiz thanh cong",
                StatusCode = (int)HttpStatusCode.OK,
                Data = new CreateQuizResponse
                {
                    QuizId = quiz.QuizId
                }
            };
        }
        catch (Exception)
        {
            // 8. Rollback hoàn toàn nếu lỗi nửa chừng
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<ApiResponse<QuizDetailResponse>> GetQuizDetailAsync(int quizId, string userEmail)
    {
        var safeEmail = userEmail?.Trim().ToLower();

        // 1. Xác thực tài khoản người dùng trước
        var account = await _context.Accounts
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.Email == safeEmail && !a.IsDelete);

        if (account == null)
        {
            return new ApiResponse<QuizDetailResponse>
            {
                Success = false,
                Message = "Tai khoan khong ton tai",
                StatusCode = (int)HttpStatusCode.NotFound
            };
        }

        // 2. KỸ THUẬT SENIOR: Eager Loading lấy trọn gói dữ liệu trong 1 Query duy nhất
        var quiz = await _context.Quizzes
            .AsNoTracking() // Dùng AsNoTracking vì đây là lệnh GET, giúp TiDB chạy cực nhanh
            .Include(q => q.Questions)               // Lấy các câu hỏi thuộc Quiz này
                .ThenInclude(question => question.Answers) // Lấy các câu trả lời thuộc từng câu hỏi đó
            .FirstOrDefaultAsync(q => q.QuizId == quizId && q.AccountId == account.AccountId);

        if (quiz == null)
        {
            return new ApiResponse<QuizDetailResponse>
            {
                Success = false,
                Message = "Quiz khong ton tai hoặc bạn khong co quyen xem",
                StatusCode = (int)HttpStatusCode.NotFound
            };
        }

        // 3. MAP SANG DTO: Chuyển đổi cấu trúc Entity thành JSON sạch cho React
        var responseData = new QuizDetailResponse
        {
            QuizId = quiz.QuizId,
            Title = quiz.Title,
            Description = quiz.Description,
            Questions = quiz.Questions.Select(q => new QuestionDetailResponse
            {
                QuestionId = q.QuestionId,
                Content = q.Content,
                Type = q.Type, // Chuyển Enum thành String ("SingleChoice")
                Score = q.Score,
                Answers = q.Answers.Select(a => new AnswerDetailResponse
                {
                    AnswerId = a.AnswerId,
                    Content = a.Content,
                    IsCorrect = a.IsCorrect,
                    OrderIndex = (byte)a.OrderIndex // Cast từ Enum byte về số
                }).ToList()
            }).ToList()
        };

        return new ApiResponse<QuizDetailResponse>
        {
            Success = true,
            Message = "Lay thong tin chi tiet quiz thanh cong",
            StatusCode = (int)HttpStatusCode.OK,
            Data = responseData
        };
    }

    public async Task<PagedResponse<GetQuizzesResponse>> GetQuizzesAsync(int page, int pageSize, string? search)
    {
        // 1. Chuẩn hóa tham số phân trang
        page = page <= 0 ? 1 : page;
        pageSize = pageSize <= 0 ? 10 : pageSize;
        pageSize = Math.Min(pageSize, 50);

        // 2. Khởi tạo Query gốc
        var query = _context.Quizzes.AsNoTracking();

        // 3. Thực hiện lọc dữ liệu (Server-Side Search) nếu có từ khóa tìm kiếm
        if (!string.IsNullOrWhiteSpace(search))
        {
            string cleanSearch = search.Trim().ToLower();
            
            // Lọc theo Title HOẶC Description (Có check null an toàn cho DB)
            query = query.Where(q => 
                (q.Title != null && q.Title.ToLower().Contains(cleanSearch)) ||
                (q.Description != null && q.Description.ToLower().Contains(cleanSearch))
            );
        }

        // 4. Tính toán tổng số Items sau khi đã lọc dữ liệu (Quan trọng cho Pagination)
        var totalItems = await query.CountAsync();

        // 5. Phân trang và Mapping dữ liệu ra DTO
        var quizzes = await query
            .OrderByDescending(q => q.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(q => new GetQuizzesResponse
            {
                QuizId = q.QuizId,
                Title = q.Title,
                Description = q.Description,
                TotalQuestions = q.Questions.Count,
                CreatedAt = q.CreatedAt
            })
            .ToListAsync();

        // 6. Trả về cấu trúc PagedResponse hoàn chỉnh
        return new PagedResponse<GetQuizzesResponse>
        {
            Items = quizzes,
            Page = page,
            PageSize = pageSize,
            TotalItems = totalItems,
            TotalPages = (int)Math.Ceiling(totalItems / (double)pageSize)
        };
    }

    public async Task<bool> SoftDeleteQuizAsync(int quizId,int accountId)
    {
        var quiz = await _context.Quizzes
            .FirstOrDefaultAsync(q =>
                q.QuizId == quizId &&
                q.AccountId == accountId);

        if (quiz == null)
        {
            return false;
        }

        quiz.IsDeleted = true;

        await _context.SaveChangesAsync();

        return true;
    }

    
}