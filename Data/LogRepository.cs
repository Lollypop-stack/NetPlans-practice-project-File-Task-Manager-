using CicdDashboardMini.Models;

namespace CicdDashboardMini.Data;

public static class LogRepository
{
    public static List<LogRecord> GetAll()
    {
        var result = new List<LogRecord>();

        using var connection = Database.GetConnection();
        connection.Open();

        using var command = connection.CreateCommand();
        command.CommandText = """
            SELECT Id, Date, User, Action, Target, TargetId
            FROM Logs
            ORDER BY Id DESC
            """;

        using var reader = command.ExecuteReader();
        while (reader.Read())
        {
            result.Add(new LogRecord
            {
                Id = reader.GetInt32(0),
                Date = reader.IsDBNull(1) ? DateTime.MinValue : DateTime.Parse(reader.GetString(1)),
                User = reader.GetString(2),
                Action = reader.GetString(3),
                Target = reader.GetString(4),
                TargetId = reader.IsDBNull(5) ? 0 : reader.GetInt32(5)
            });
        }

        return result;
    }
    public static void Add(string user, string action, string target, int TargetId)
    {

        using var connection = Database.GetConnection();
        connection.Open();

        using var command = connection.CreateCommand();

        command.CommandText = """
        INSERT INTO Logs (Date, User, Action, Target, TargetId)
        VALUES
        (@date, @user, @action, @target, @targetId)
        """;

        command.Parameters.AddWithValue("@date", DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss"));
        command.Parameters.AddWithValue("@user", user);
        command.Parameters.AddWithValue("@action", action);
        command.Parameters.AddWithValue("@target", target);
        command.Parameters.AddWithValue("@targetId", TargetId);

        command.ExecuteNonQuery();
    }

    public static bool Delete(int id)
    {
        using var connection = Database.GetConnection();
        connection.Open();

        using var command = connection.CreateCommand();

        command.CommandText = """
        DELETE FROM Logs
        WHERE Id = @id
        """;

        command.Parameters.AddWithValue("@id", id);

        return command.ExecuteNonQuery() > 0;
    }

}