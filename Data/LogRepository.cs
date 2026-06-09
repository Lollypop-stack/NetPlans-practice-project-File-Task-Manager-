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
            SELECT Id, Date, User, Action, Target
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
                Target = reader.GetString(4)
            });
        }

        return result;
    }
}