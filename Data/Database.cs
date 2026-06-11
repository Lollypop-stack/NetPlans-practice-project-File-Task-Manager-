using BCrypt.Net;
using Microsoft.Data.Sqlite;

namespace CicdDashboardMini.Data;

public static class Database
{
    private static readonly string DatabaseDirectory = Path.Combine(AppContext.BaseDirectory, "app_data");
    private static readonly string DatabaseFile = Path.Combine(DatabaseDirectory, "dashboard.db");

    public static SqliteConnection GetConnection()
    {
        if (!Directory.Exists(DatabaseDirectory))
        {
            Directory.CreateDirectory(DatabaseDirectory);
        }

        return new SqliteConnection($"Data Source={DatabaseFile}");
    }

    public static void Initialize()
    {
        using var connection = GetConnection();
        connection.Open();

        using var command = connection.CreateCommand();
        command.CommandText = """
            CREATE TABLE IF NOT EXISTS Files (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                FileName TEXT NOT NULL,
                Version INTEGER NOT NULL DEFAULT 1,
                LastModified TEXT NOT NULL,
                ModifiedBy TEXT NOT NULL DEFAULT 'system'
            );

            CREATE TABLE IF NOT EXISTS Tasks (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                Title TEXT NOT NULL,
                FileName TEXT NOT NULL,
                AssignedUser TEXT NOT NULL DEFAULT 'Admin',
                Status TEXT NOT NULL DEFAULT 'Open',
                Deadline TEXT NOT NULL,
                IsDeleted INTEGER NOT NULL DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS Logs (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                Date TEXT NOT NULL,
                User TEXT NOT NULL DEFAULT 'system',
                Action TEXT NOT NULL,
                Target TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS Settings (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                Language TEXT NOT NULL DEFAULT 'en',
                Theme TEXT NOT NULL DEFAULT 'dark',
                FontSize TEXT NOT NULL DEFAULT 'medium',
                Timezone TEXT NOT NULL DEFAULT 'Europe/Berlin',
                StoragePath TEXT NOT NULL DEFAULT ''
            );

            CREATE TABLE IF NOT EXISTS Users (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                Username TEXT NOT NULL UNIQUE,
                PasswordHash TEXT NOT NULL,
                CreatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
            """;
            try
            {
                using var alterCommand = connection.CreateCommand();

                alterCommand.CommandText = """
                    ALTER TABLE Tasks
                    ADD COLUMN IsDeleted INTEGER NOT NULL DEFAULT 0;
                    """;

                alterCommand.ExecuteNonQuery();
            }
            catch
            {
            }
            

        command.ExecuteNonQuery();

        EnsureSeedData(connection);
    }

    private static void EnsureSeedData(SqliteConnection connection)
    {
        using var countFiles = connection.CreateCommand();
        countFiles.CommandText = "SELECT COUNT(*) FROM Files";
        var filesCount = Convert.ToInt32(countFiles.ExecuteScalar());

        if (filesCount == 0)
        {
            using var insertFiles = connection.CreateCommand();
            insertFiles.CommandText = """
                INSERT INTO Files (FileName, Version, LastModified, ModifiedBy)
                VALUES
                    ('README.md', 1, '2026-06-09T10:00:00', 'Admin'),
                    ('pipeline.yaml', 2, '2026-06-09T11:30:00', 'CI Bot')
                """;
            insertFiles.ExecuteNonQuery();
        }

        using var countTasks = connection.CreateCommand();
        countTasks.CommandText = "SELECT COUNT(*) FROM Tasks";
        var tasksCount = Convert.ToInt32(countTasks.ExecuteScalar());

        if (tasksCount == 0)
        {
            using var insertTasks = connection.CreateCommand();
            insertTasks.CommandText = """
                INSERT INTO Tasks (Title, FileName, AssignedUser, Status, Deadline)
                VALUES
                    ('Review deployment', 'pipeline.yaml', 'Admin', 'In Progress', '2026-06-10T18:00:00'),
                    ('Prepare release notes', 'README.md', 'QA', 'Open', '2026-06-12T12:00:00')
                """;
            insertTasks.ExecuteNonQuery();
        }

        using var countLogs = connection.CreateCommand();
        countLogs.CommandText = "SELECT COUNT(*) FROM Logs";
        var logsCount = Convert.ToInt32(countLogs.ExecuteScalar());

        if (logsCount == 0)
        {
            using var insertLogs = connection.CreateCommand();
            insertLogs.CommandText = """
                INSERT INTO Logs (Date, User, Action, Target)
                VALUES
                    ('2026-06-09T09:00:00', 'Admin', 'Created project', 'Dashboard'),
                    ('2026-06-09T09:15:00', 'CI Bot', 'Updated pipeline', 'pipeline.yaml')
                """;
            insertLogs.ExecuteNonQuery();
        }

        using var countUsers = connection.CreateCommand();
        countUsers.CommandText = "SELECT COUNT(*) FROM Users";
        var usersCount = Convert.ToInt32(countUsers.ExecuteScalar());

        if (usersCount == 0)
        {
            using var insertAdmin = connection.CreateCommand();
            insertAdmin.CommandText = """
                INSERT INTO Users (Username, PasswordHash, CreatedAt)
                VALUES (@username, @passwordHash, @createdAt)
                """;
            insertAdmin.Parameters.AddWithValue("@username", "admin");
            insertAdmin.Parameters.AddWithValue("@passwordHash", BCrypt.Net.BCrypt.HashPassword("admin", 12));
            insertAdmin.Parameters.AddWithValue("@createdAt", DateTime.UtcNow.ToString("O"));
            insertAdmin.ExecuteNonQuery();
        }

        using var countSettings = connection.CreateCommand();
        countSettings.CommandText = "SELECT COUNT(*) FROM Settings";
        var settingsCount = Convert.ToInt32(countSettings.ExecuteScalar());

        if (settingsCount == 0)
        {
            using var insertSettings = connection.CreateCommand();
            insertSettings.CommandText = """
                INSERT INTO Settings (Language, Theme, FontSize, Timezone, StoragePath)
                VALUES ('en', 'dark', 'medium', 'Europe/Berlin', '')
                """;
            insertSettings.ExecuteNonQuery();
        }
    }
}
