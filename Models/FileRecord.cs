namespace CicdDashboardMini.Models;

public class FileRecord
{
    public int Id { get; set; }

    public string FileName { get; set; } = "";

    public int Version { get; set; }

    public DateTime LastModified { get; set; }

    public string ModifiedBy { get; set; } = "";
}