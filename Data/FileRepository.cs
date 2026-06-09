using CicdDashboardMini.Models;

namespace CicdDashboardMini.Data;

public static class FileRepository
{
    public static List<FileRecord> GetAll()
    {
        var result = new List<FileRecord>();

        using var connection = Database.GetConnection();

        connection.Open();

        var command = connection.CreateCommand();

        command.CommandText =
        """
        SELECT
            Id,
            FileName,
            Version,
            LastModified,
            ModifiedBy
        FROM Files
        """;

        using var reader = command.ExecuteReader();

        while (reader.Read())
        {
            result.Add(new FileRecord
            {
                Id = reader.GetInt32(0),
                FileName = reader.GetString(1),
                Version = reader.GetInt32(2),
                LastModified = DateTime.Parse(reader.GetString(3)),
                ModifiedBy = reader.GetString(4)
            });
        }

        return result;
    }

    public static void AddFile(
    string fileName,
    int version,
    string modifiedBy)
{
    using var connection = Database.GetConnection();

    connection.Open();

    var command = connection.CreateCommand();

    command.CommandText =
    """
    INSERT INTO Files
    (
        FileName,
        Version,
        LastModified,
        ModifiedBy
    )
    VALUES
    (
        $fileName,
        $version,
        $lastModified,
        $modifiedBy
    );
    """;

    command.Parameters.AddWithValue("$fileName", fileName);
    command.Parameters.AddWithValue("$version", version);
    command.Parameters.AddWithValue("$lastModified", DateTime.Now.ToString("s"));
    command.Parameters.AddWithValue("$modifiedBy", modifiedBy);

    command.ExecuteNonQuery();
}
}
