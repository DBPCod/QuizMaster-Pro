using System.Text;
using DotNetEnv;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using QuizBackend.Data;
using QuizBackend.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition(
        "Bearer",
        new OpenApiSecurityScheme
        {
            Name = "Authorization",
            Type = SecuritySchemeType.Http, // Thay ApiKey bằng Http
            Scheme = "bearer", // Thêm dòng này (viết thường)
            BearerFormat = "JWT",
            In = ParameterLocation.Header,
            Description = "Chỉ cần dán Token vào đây (không cần gõ Bearer)",
        }
    );

    c.AddSecurityRequirement(
        new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer",
                    },
                },
                new string[] { }
            },
        }
    );
});
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "MyAllowSpecificOrigins",
        policy =>
        {
            policy
                .WithOrigins("http://localhost:5174") // Địa chỉ của Frontend Vite
                .AllowAnyHeader()
                .AllowAnyMethod();
        }
    );
});
builder.Services.AddControllers();

//load file .env
DotNetEnv.Env.Load();

//lấy key từ biến môi trường
var secretKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY");

if (string.IsNullOrEmpty(secretKey))
{
    throw new Exception("Quên cấu hình Secret Key");
}

var key = Encoding.ASCII.GetBytes(secretKey);
builder
    .Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = false, // Chỉnh thành true nếu bạn có quy định Issuer
            ValidateAudience = false, // Chỉnh thành true nếu bạn có quy định Audience
            ClockSkew = TimeSpan.Zero,
        };
    });

//Lấy connection string từ file JSON
var connectionString = builder.Configuration.GetConnectionString("TiDBConnection");

//Đăng ký DbContext
builder.Services.AddDbContext<MyDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString))
);

builder.Services.AddScoped<IAuthService, AuthService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseHttpsRedirection();
app.UseCors("MyAllowSpecificOrigins");
app.UseAuthentication(); // Giải mã token, xác định User là ai
app.UseAuthorization();
app.MapControllers();
var summaries = new[]
{
    "Freezing",
    "Bracing",
    "Chilly",
    "Cool",
    "Mild",
    "Warm",
    "Balmy",
    "Hot",
    "Sweltering",
    "Scorching",
};

app.Run();
