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
}