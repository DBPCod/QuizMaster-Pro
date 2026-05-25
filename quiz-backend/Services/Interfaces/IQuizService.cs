using QuizBackend.Common;

public interface IQuizService
{
    Task<ApiResponse<CreateQuizResponse>> CreateComplexQuizAsync(QuizRequest request, string userEmail);
    Task<bool> SoftDeleteQuizAsync(int quizId, int accountId);

    Task<ApiResponse<CreateQuizResponse>> UpdateComplexQuizAsync(int quizId, QuizRequest request, string userEmail);
    Task<ApiResponse<QuizDetailResponse>> GetQuizDetailAsync(int quizId, string userEmail);
    Task<PagedResponse<GetQuizzesResponse>> GetQuizzesAsync(int page, int pageSize, string? search);

}