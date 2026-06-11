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
            WHERE IsDeleted = 0
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

    public static bool UpdateStatus(int id, string status)
    {
        using var connection = Database.GetConnection();
        connection.Open();

        string title = "";

        using (var selectCommand = connection.CreateCommand())
        {
            selectCommand.CommandText = """
            SELECT Title
            FROM Tasks
            WHERE Id = @id
            """;

            selectCommand.Parameters.AddWithValue("@id", id);

            title = selectCommand.ExecuteScalar()?.ToString() ?? "";
        }

        using var command = connection.CreateCommand();

        command.CommandText = """
        UPDATE Tasks
        SET Status = @status
        WHERE Id = @id
        """;

        command.Parameters.AddWithValue("@status", status);
        command.Parameters.AddWithValue("@id", id);

        if (command.ExecuteNonQuery() > 0)
        {
            LogRepository.Add(
                "Admin",
                $"Changed status to {status}",
                title,
                id
            );

            return true;
        }

        return false;
    }

    public static bool Delete(int id)
    {
        using var connection = Database.GetConnection();
        connection.Open();

        string title = "";

        using (var selectCommand = connection.CreateCommand())
        {
            selectCommand.CommandText = """
            SELECT Title
            FROM Tasks
            WHERE Id = @id
            """;

            selectCommand.Parameters.AddWithValue("@id", id);

            title = selectCommand.ExecuteScalar()?.ToString() ?? "";
        }

        using (var deleteCommand = connection.CreateCommand())
        {
            deleteCommand.CommandText = """
            UPDATE Tasks
            SET IsDeleted = 1
            WHERE Id = @id
            """;

            deleteCommand.Parameters.AddWithValue("@id", id);

            if (deleteCommand.ExecuteNonQuery() == 0)
            {
                return false;
            }
        }

        LogRepository.Add(
            "Admin",
            "Deleted task",
            title,
            id
        );

        return true;
    }

    public static bool Restore(int id)
    {
        using var connection = Database.GetConnection();
        connection.Open();

        string title = "";

        using (var selectCommand = connection.CreateCommand())
        {
            selectCommand.CommandText = """
            SELECT Title
            FROM Tasks
            WHERE Id = @id
            """;

            selectCommand.Parameters.AddWithValue("@id", id);

            title = selectCommand.ExecuteScalar()?.ToString() ?? "";
        }

        using (var command = connection.CreateCommand())
        {
            command.CommandText = """
            UPDATE Tasks
            SET IsDeleted = 0
            WHERE Id = @id
            """;

            command.Parameters.AddWithValue("@id", id);

            if (command.ExecuteNonQuery() > 0)
            {
                LogRepository.Add(
                    "Admin",
                    "Restored task",
                    title,
                    id
                );

                return true;
            }
        }

        return false;
    }

    public static List<TaskRecord> GetDeleted()
    {
        var result = new List<TaskRecord>();

        using var connection = Database.GetConnection();
        connection.Open();

        using var command = connection.CreateCommand();

        command.CommandText = """
        SELECT Id, Title, FileName, AssignedUser, Status, Deadline
        FROM Tasks
        WHERE IsDeleted = 1
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
                Deadline = reader.IsDBNull(5)
                    ? DateTime.MinValue
                    : DateTime.Parse(reader.GetString(5))
            });
        }

        return result;
    }
}



