const languageSelect = document.getElementById("language");
const themeSelect = document.getElementById("theme");
const fontSizeSelect = document.getElementById("fontSize");
const timezoneSelect = document.getElementById("timezone");
const storagePathInput = document.getElementById("storagePath");
const saveButton = document.getElementById("saveSettings");

loadSettings();

saveButton.addEventListener("click", saveSettings);

function saveSettings() {

    const settings = {
        language: languageSelect.value,
        theme: themeSelect.value,
        fontSize: fontSizeSelect.value,
        timezone: timezoneSelect.value,
        storagePath: storagePathInput.value
    };

    localStorage.setItem(
        "userSettings",
        JSON.stringify(settings)
    );

    applySettings(settings);

    alert("Einstellungen gespeichert.");
}

function loadSettings() {

    const savedSettings =
        localStorage.getItem("userSettings");

    if (!savedSettings)
        return;

    const settings =
        JSON.parse(savedSettings);

    languageSelect.value =
        settings.language || "de";

    themeSelect.value =
        settings.theme || "dark";

    fontSizeSelect.value =
        settings.fontSize || "medium";

    timezoneSelect.value =
        settings.timezone || "Europe/Berlin";

    storagePathInput.value =
        settings.storagePath || "";

    applySettings(settings);
}

function applySettings(settings) {

    applyTheme(settings.theme);
    applyFontSize(settings.fontSize);
}

function applyTheme(theme) {
    if (theme === "system") {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        document.body.classList.toggle("light-theme", !prefersDark);
        return;
    }

    switch (theme) {
        case "light":
            document.body.classList.add("light-theme");
            break;

        case "dark":
        default:
            document.body.classList.remove("light-theme");
            break;
    }
}

function applyFontSize(size) {

    document.body.classList.remove(
        "font-small",
        "font-medium",
        "font-large"
    );

    document.body.classList.add(`font-${size}`);
}

const browsePathButton = document.getElementById("browsePath");

if (browsePathButton) {
    browsePathButton.addEventListener("click", async () => {
        if (window.api && typeof window.api.selectFolder === "function") {
            const folder = await window.api.selectFolder();
            if (folder)
                storagePathInput.value = folder;
            return;
        }

        const folder = prompt("Enter storage path:");
        if (folder)
            storagePathInput.value = folder;
    });
}