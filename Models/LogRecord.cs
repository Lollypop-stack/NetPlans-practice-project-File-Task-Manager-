namespace CicdDashboardMini.Models;

public class LogRecord
{
    public int Id { get; set; }

    public DateTime Date { get; set; }

    public string User { get; set; } = "";

    public string Action { get; set; } = "";

    public string Target { get; set; } = "";
}