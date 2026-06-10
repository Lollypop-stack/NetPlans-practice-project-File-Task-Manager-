using CicdDashboardMini.Data;
using Microsoft.Extensions.FileProviders;
using CicdDashboardMini.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

Database.Initialize();

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(builder.Environment.ContentRootPath, "FrontendPage")),
    RequestPath = "/FrontendPage"
});

app.MapGet("/", () => Results.Redirect("/FrontendPage/login.html"));

app.MapGet("/api/files", () =>
{
    return FileRepository.GetAll();
});

app.MapGet("/api/tasks/deleted", () =>
{
    return TaskRepository.GetDeleted();
});

app.MapPut("/api/tasks/{id}/restore", (int id) =>
{
    var success = TaskRepository.Restore(id);

    return success
        ? Results.Ok()
        : Results.NotFound();
});

app.MapGet("/api/tasks", () =>
{
    return TaskRepository.GetAll();
});

app.MapPut("/api/tasks/{id}/status", (int id, StatusRequest request) =>
{
    var success = TaskRepository.UpdateStatus(id, request.Status);

    return success
        ? Results.Ok()
        : Results.NotFound();
});

app.MapGet("/api/logs", () =>
{
    return LogRepository.GetAll();
});

app.MapDelete("/api/tasks/{id}", (int id) =>
{
    var success = TaskRepository.Delete(id);

    return success
        ? Results.Ok()
        : Results.NotFound();
});

app.MapGet("/api/settings", () =>
{
    return SettingsRepository.Get();
});

app.MapPost("/api/auth/register", (AuthRegisterRequest request) =>
{
    if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
    {
        return Results.BadRequest(new { success = false, message = "Username and password are required." });
    }

    if (request.Username.Length < 3 || request.Password.Length < 4)
    {
        return Results.BadRequest(new { success = false, message = "Username must be at least 3 characters and password at least 4 characters." });
    }

    if (UserRepository.FindByUsername(request.Username) is not null)
    {
        return Results.Conflict(new { success = false, message = "Username already exists." });
    }

    var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password, 12);
    var created = UserRepository.Create(request.Username, passwordHash);

    if (!created)
    {
        return Results.Conflict(new { success = false, message = "Username already exists." });
    }

    return Results.Ok(new { success = true, message = "Account created successfully." });
});

app.MapPost("/api/auth/login", (AuthLoginRequest request) =>
{
    if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
    {
        return Results.BadRequest(new { success = false, message = "Username and password are required." });
    }

    var valid = UserRepository.VerifyPassword(request.Username, request.Password);
    if (!valid)
    {
        return Results.Unauthorized();
    }

    return Results.Ok(new { success = true, username = request.Username, message = "Login successful." });
});

Console.WriteLine(builder.Environment.ContentRootPath);

app.Run();

record AuthRegisterRequest(string Username, string Password);
record AuthLoginRequest(string Username, string Password);