using CicdDashboardMini.Models;
using Microsoft.Data.Sqlite;

namespace CicdDashboardMini.Data;

public static class UserRepository
{
    public static UserRecord? FindByUsername(string username)
    {
        using var connection = Database.GetConnection();
        connection.Open();

        using var command = connection.CreateCommand();
        command.CommandText = """
            SELECT Id, Username, PasswordHash, CreatedAt
            FROM Users
            WHERE Username = @username
            """;

        command.Parameters.AddWithValue("@username", username);

        using var reader = command.ExecuteReader();
        if (!reader.Read())
        {
            return null;
        }

        return new UserRecord
        {
            Id = reader.GetInt32(0),
            Username = reader.GetString(1),
            PasswordHash = reader.GetString(2),
            CreatedAt = DateTime.Parse(reader.GetString(3))
        };
    }

    public static bool Create(string username, string passwordHash)
    {
        if (FindByUsername(username) is not null)
        {
            return false;
        }

        using var connection = Database.GetConnection();
        connection.Open();

        using var command = connection.CreateCommand();
        command.CommandText = """
            INSERT INTO Users (Username, PasswordHash, CreatedAt)
            VALUES (@username, @passwordHash, @createdAt)
            """;

        command.Parameters.AddWithValue("@username", username);
        command.Parameters.AddWithValue("@passwordHash", passwordHash);
        command.Parameters.AddWithValue("@createdAt", DateTime.UtcNow.ToString("O"));

        command.ExecuteNonQuery();
        return true;
    }

    public static bool VerifyPassword(string username, string password)
    {
        var user = FindByUsername(username);
        if (user is null)
        {
            return false;
        }

        return BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
    }
}
