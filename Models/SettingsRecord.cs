namespace CicdDashboardMini.Models;

public class SettingsRecord
{
    public string Language { get; set; } = "en";

    public string Theme { get; set; } = "dark";

    public string FontSize { get; set; } = "medium";

    public string Timezone { get; set; } = "Europe/Berlin";

    public string StoragePath { get; set; } = "";
}