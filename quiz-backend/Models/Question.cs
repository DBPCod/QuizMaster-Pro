using QuizBackend.Models;

public class Question
{
    public int QuestionId {get; set;}
    public string Content {get; set;}
    public QuestionType Type {get; set;} = QuestionType.Single_choice;

    public decimal  Score {get; set;} = 0;
    public int QuizId {get; set;}

    public Quiz Quiz {get; set;} = null!;

    public ICollection<Answer> Answers = new List<Answer>();
}