using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QuizBackend.Common;
using QuizBackend.DTOs.Responses;

namespace QuizBackend.Controllers
{
    [Route("api/quizzes")] // Đường dẫn chuẩn: api/quizzes
    [ApiController]
    public class QuizController : ControllerBase // Bắt buộc kế thừa ControllerBase
    {
        private readonly IQuizService _quizService;

        // Tiêm (Inject) Service vào Controller, tuyệt đối không tiêm DbContext vào đây
        public QuizController(IQuizService quizService)
        {
            _quizService = quizService;
        }

        [HttpGet("{quizId}")]
        [Authorize]
        public async Task<IActionResult> GetQuiz(int quizId)
        {
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(userEmail))
            {
                return Unauthorized(new ApiResponse<GetQuizResponse>
                {
                    Success = false,
                    Message = "Phiên đăng nhập không hợp lệ hoặc đã hết hạn.",
                    StatusCode = 401
                });
            }

            var result = await _quizService.GetQuizDetailAsync(quizId, userEmail);
            return StatusCode(result.StatusCode, result);
        }

        [HttpPost]
        [Authorize] // Bắt buộc phải đăng nhập để lấy Token JWT
        public async Task<IActionResult> CreateQuiz([FromBody] QuizRequest request)
        {
            // GIAI ĐOẠN 1: Kiểm tra tính hợp lệ của dữ liệu đầu vào (Validation)
            if (!ModelState.IsValid)
            {
                return BadRequest(new ApiResponse<CreateQuizResponse>
                {
                    Success = false,
                    Message = "Dữ liệu gửi lên không hợp lệ.",
                    StatusCode = 400
                });
            }

            // GIAI ĐOẠN 2: Trích xuất Email an toàn từ Token JWT (Chống giả mạo User)
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(userEmail))
            {
                return Unauthorized(new ApiResponse<CreateQuizResponse>
                {
                    Success = false,
                    Message = "Phiên đăng nhập không hợp lệ hoặc đã hết hạn.",
                    StatusCode = 401
                });
            }

            // GIAI ĐOẠN 3: Ủy quyền toàn bộ logic xử lý dữ liệu cho tầng Service
            var result = await _quizService.CreateComplexQuizAsync(request, userEmail);

            // GIAI ĐOẠN 4: Trả về trạng thái HTTP Code động dựa trên kết quả của Service
            return StatusCode(result.StatusCode, result);
        }

        [HttpPut("{quizId}")]
        [Authorize]
        public async Task<IActionResult> UpdateComplexQuizAsync([FromBody] QuizRequest request, int quizId)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(new ApiResponse<UpdateQuizResponse>
                {
                    Success = false,
                    Message = "Dữ liệu gửi lên không hợp lệ.",
                    StatusCode = 400
                });
            }

            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(userEmail))
            {
                return Unauthorized(new ApiResponse<UpdateQuizResponse>
                {
                    Success = false,
                    Message = "Phiên đăng nhập không hợp lệ hoặc đã hết hạn.",
                    StatusCode = 401
                });
            }
            
            var result = await _quizService.UpdateComplexQuizAsync(quizId,request, userEmail);

            // GIAI ĐOẠN 4: Trả về trạng thái HTTP Code động dựa trên kết quả của Service
            return StatusCode(result.StatusCode, result);
        }

        [HttpDelete("{quizId}")]
        public async Task<IActionResult> DeleteQuiz(int quizId)
        {
            var accountIdClaim = User.FindFirstValue(
                ClaimTypes.NameIdentifier);

            if (!int.TryParse(accountIdClaim, out int accountId))
            {
                return Unauthorized(new
                {
                    success = false,
                    message = "Token không hợp lệ."
                });
            }

            var deleted = await _quizService
                .SoftDeleteQuizAsync(quizId, accountId);

            if (!deleted)
            {
                return NotFound(new
                {
                    success = false,
                    message = "Quiz không tồn tại hoặc bạn không có quyền."
                });
            }

            return Ok(new
            {
                success = true,
                message = "Xóa quiz thành công."
            });
        }
    }
}
