namespace CicdDashboardMini.Models;

public class TaskRecord
{
    public int Id { get; set; }

    public string Title { get; set; } = "";

    public string FileName { get; set; } = "";

    public string AssignedUser { get; set; } = "";

    public string Status { get; set; } = "";

    public DateTime Deadline { get; set; }
}