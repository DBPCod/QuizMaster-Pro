using QuizBackend.Common;

public interface IQuizService
{
    Task<ApiResponse<CreateQuizResponse>> CreateComplexQuizAsync(QuizRequest request, string userEmail);
    Task<bool> SoftDeleteQuizAsync(int quizId, int accountId);
}