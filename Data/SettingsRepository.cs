using CicdDashboardMini.Models;

namespace CicdDashboardMini.Data;

public static class SettingsRepository
{
    public static SettingsRecord Get()
    {
        using var connection = Database.GetConnection();
        connection.Open();

        using var command = connection.CreateCommand();
        command.CommandText = """
            SELECT Id, Language, Theme, FontSize, Timezone, StoragePath
            FROM Settings
            ORDER BY Id DESC
            LIMIT 1
            """;

        using var reader = command.ExecuteReader();
        if (reader.Read())
        {
            return new SettingsRecord
            {
                Language = reader.GetString(1),
                Theme = reader.GetString(2),
                FontSize = reader.GetString(3),
                Timezone = reader.GetString(4),
                StoragePath = reader.GetString(5)
            };
        }

        return new SettingsRecord();
    }

    public static void Save(SettingsRecord settings)
    {
        using var connection = Database.GetConnection();
        connection.Open();

        using var command = connection.CreateCommand();
        command.CommandText = """
            INSERT INTO Settings (Language, Theme, FontSize, Timezone, StoragePath)
            VALUES (@language, @theme, @fontSize, @timezone, @storagePath)
            """;

        command.Parameters.AddWithValue("@language", settings.Language);
        command.Parameters.AddWithValue("@theme", settings.Theme);
        command.Parameters.AddWithValue("@fontSize", settings.FontSize);
        command.Parameters.AddWithValue("@timezone", settings.Timezone);
        command.Parameters.AddWithValue("@storagePath", settings.StoragePath ?? string.Empty);

        command.ExecuteNonQuery();
    }
}
