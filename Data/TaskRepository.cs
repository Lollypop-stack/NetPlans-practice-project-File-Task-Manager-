using CicdDashboardMini.Models;

namespace CicdDashboardMini.Data;

public static class TaskRepository
{
    public static List<TaskRecord> GetAll()
    {
        var result = new List<TaskRecord>();

        using var connection = Database.GetConnection();
        connection.Open();

        using var command = connection.CreateCommand();
        command.CommandText = """
            SELECT Id, Title, FileName, AssignedUser, Status, Deadline
            FROM Tasks
            ORDER BY Id DESC
            """;

        using var reader = command.ExecuteReader();
        while (reader.Read())
        {
            result.Add(new TaskRecord
            {
                Id = reader.GetInt32(0),
                Title = reader.GetString(1),
                FileName = reader.GetString(2),
                AssignedUser = reader.GetString(3),
                Status = reader.GetString(4),
                Deadline = reader.IsDBNull(5) ? DateTime.MinValue : DateTime.Parse(reader.GetString(5))
            });
        }

        return result;
    }
}