using System.Text.RegularExpressions;

public class Valid
{
    private static readonly Regex PasswordRegex = new Regex(
        @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$"
    );

    public static (bool IsValid, string Message) Validate(string password)
    {
        if (string.IsNullOrWhiteSpace(password))
            return (false, "Mật khẩu không được để trống.");

        if (password.Length < 8)
            return (false, "Mật khẩu phải có ít nhất 8 ký tự.");

        if (!PasswordRegex.IsMatch(password))
        {
            Console.WriteLine(password);
            return (false, "Mật khẩu phải bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.");
        }
        return (true, string.Empty);
    }
}
