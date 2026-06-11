const SETTINGS_KEY = 'userSettings';
const defaultSettings = {
    language: 'en',
    theme: 'dark',
    fontSize: 'medium',
    timezone: 'Europe/Berlin',
    storagePath: ''
};

const translations = {
    en: {
        date: 'Date',
        createTask: 'Create Task',
        sortBy: 'Sort by: ',
        filterButton: 'Open Filters',
        appTitle: 'File Task Manager',
        dashboard: 'Dashboard',
        files: 'Files',
        tasks: 'Tasks',
        logs: 'Logs',
        settings: 'Settings',
        totalFiles: 'Total Files',
        activeTasks: 'Active Tasks',
        completedTasks: 'Completed Tasks',
        users: 'Users',
        file: 'File',
        AbandonedTasks: 'Abandoned Tasks',
        assignedUser: 'Assigned User',
        status: 'Status: ',
        lastModified: 'Last Modified: ',
        action: 'Action',
        taskDetails: 'Task Details',
        fileLabel: 'File:',
        userLabel: 'User:',
        descriptionLabel: 'Description:',
        back: 'Back',
        uploadFile: 'Upload File',
        searchFiles: 'Search files...',
        filesTitle: 'Files',
        activityLogs: 'Activity Logs',
        searchLogs: 'Search logs...',
        tasksTitle: 'Tasks',
        searchTasks: 'Search tasks...',
        createTask: 'Create Task',
        language: 'Interface language',
        theme: 'Theme',
        fontSize: 'Font size',
        timezone: 'Timezone',
        storagePath: 'Storage path',
        browse: 'Browse',
        saveSettings: 'Save settings',
        title: 'Title',
        dark: 'Dark',
        light: 'Light',
        system: 'System',
        small: 'Small',
        medium: 'Medium',
        large: 'Large',
        deutsch: 'Deutsch',
        statusLabel: 'Status',
        lastModifiedLabel: 'Last modified',
        english: 'English',
        russian: 'Русский',
        settingsHeader: 'Settings',
        settingsSaved: 'Settings saved.',
        username: 'Username',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        signIn: 'Sign In',
        register: 'Register',
        createAccount: 'Create account!',
        welcomeBack: 'Welcome back!',
        credentialsPrompt: 'Enter your credentials to continue:',
        registerPrompt: 'Fill in the details to register:',
        placeholderUsername: 'username',
        placeholderPassword: '••••••••',
        placeholderChooseUsername: 'choose a username',
        placeholderRepeatPassword: 'repeat password',
        adminHint: 'admin / admin → admin panel',
        selectFolder: 'Select folder',
        saveChangesButton: 'Save changes',
        switchAccount: 'Switch account',
        logOut: 'Log out',
        registerAccount: 'Register account',
        deleteButton: 'Delete',
        changeStatusButton: 'Change Status',
        version: 'Version',
        modifiedBy: 'Changed by'
    },
    de: {
        date: 'Datum',
        deleteButton: 'Löschen',
        createTask: 'Aufgabe erstellen',
        sortBy: 'Sortieren nach: ',
        filterButton: 'Filter Anzeigen',
        AbandonedTasks: 'Aufgeschobene Aufgaben',
        appTitle: 'Datei-Aufgabenmanager',
        dashboard: 'Dashboard',
        files: 'Dateien',
        tasks: 'Aufgaben',
        logs: 'Protokolle',
        settings: 'Einstellungen',
        totalFiles: 'Gesamtdateien',
        activeTasks: 'Aktive Aufgaben',
        completedTasks: 'Abgeschlossene Aufgaben',
        users: 'Benutzer',
        file: 'Datei: ',
        title: 'Titel',
        assignedUser: 'Zugewiesener Benutzer',
        status: 'Status: ',
        lastModified: 'Zuletzt geändert: ',
        action: 'Aktion',
        taskDetails: 'Aufgabendetails',
        fileLabel: 'Datei:',
        file: 'Datei',
        userLabel: 'Benutzer:',
        descriptionLabel: 'Beschreibung:',
        back: 'Zurück',
        uploadFile: 'Datei hochladen',
        searchFiles: 'Dateien suchen...',
        filesTitle: 'Dateien',
        activityLogs: 'Aktivitätsprotokoll',
        searchLogs: 'Protokolle suchen...',
        tasksTitle: 'Aufgaben',
        searchTasks: 'Aufgaben suchen...',
        createTask: 'Aufgabe erstellen',
        language: 'Benutzeroberfläche Sprache',
        theme: 'Design',
        fontSize: 'Schriftgröße',
        timezone: 'Zeitzone',
        storagePath: 'Speicherpfad',
        browse: 'Durchsuchen',
        saveSettings: 'Einstellungen speichern',
        dark: 'Dunkel',
        light: 'Hell',
        system: 'System',
        small: 'Klein',
        medium: 'Mittel',
        large: 'Groß',
        deutsch: 'Deutsch',
        english: 'English',
        statusLabel: 'Status',
        lastModifiedLabel: 'Zuletzt geändert',
        saveChangesButton: 'Änderungen speichern',
        russian: 'Русский',
        settingsHeader: 'Einstellungen',
        settingsSaved: 'Einstellungen gespeichert.',
        username: 'Benutzername',
        password: 'Passwort',
        confirmPassword: 'Passwort bestätigen',
        signIn: 'Anmelden',
        register: 'Registrieren',
        createAccount: 'Konto erstellen!',
        welcomeBack: 'Willkommen zurück!',
        credentialsPrompt: 'Geben Sie Ihre Zugangsdaten ein:',
        registerPrompt: 'Füllen Sie die Daten aus, um sich zu registrieren:',
        placeholderUsername: 'Benutzername',
        placeholderPassword: '••••••••',
        placeholderChooseUsername: 'Wählen Sie einen Benutzernamen',
        placeholderRepeatPassword: 'Passwort wiederholen',
        adminHint: 'admin / admin → Admin-Bereich',
        selectFolder: 'Ordner wählen',
        switchAccount: 'Konto wechseln',
        logOut: 'Abmelden',
        registerAccount: 'Konto registrieren',
        changeStatusButton: 'Status Wächseln',
        version: 'Version',
        modifiedBy: 'Geändert von'
    },
    ru: {
        date: 'Дата',
        modifiedBy: 'Кем изменено',
        version: 'Версия',
        changeStatusButton: 'Изменить Статус',
        deleteButton: 'Удалить',
        createTask: 'Создать задачу',
        sortBy: 'Сортировать по: ', 
        filterButton: 'Открыть фильтры',
        AbandonedTasks: 'Заброшенные Задания',
        appTitle: 'Менеджер файлов и задач',
        dashboard: 'Панель',
        files: 'Файлы',
        tasks: 'Задачи',
        logs: 'Журналы',
        settings: 'Настройки',
        totalFiles: 'Всего файлов',
        title: 'Название',
        lastModifiedLabel: 'Последнее изменение',
        activeTasks: 'Активных задач',
        completedTasks: 'Выполнено задач',
        users: 'Пользователи',
        file: 'Файл',
        assignedUser: 'Ответственный',
        status: 'Статус: ',
        statusLabel: 'Статус',
        lastModified: 'Последнее изменение: ',
        lastModifiedLabel: 'Последнее изменение',
        action: 'Действие',
        taskDetails: 'Детали задачи: ',
        fileLabel: 'Файл:',
        userLabel: 'Пользователь:',
        descriptionLabel: 'Описание:',
        back: 'Назад',
        uploadFile: 'Загрузить файл',
        searchFiles: 'Поиск файлов...',
        filesTitle: 'Файлы',
        activityLogs: 'Журнал действий',
        searchLogs: 'Поиск в журналах...',
        tasksTitle: 'Задачи',
        searchTasks: 'Поиск задач...',
        createTask: 'Создать задачу',
        language: 'Язык интерфейса',
        theme: 'Тема',
        fontSize: 'Размер шрифта',
        timezone: 'Часовой пояс',
        storagePath: 'Путь хранения',
        browse: 'Обзор',
        saveSettings: 'Сохранить',
        saveChangesButton: 'Сохранить изменения',
        dark: 'Тёмная',
        light: 'Светлая',
        system: 'Системная',
        small: 'Маленький',
        medium: 'Средний',
        large: 'Большой',
        deutsch: 'Deutsch',
        english: 'English',
        russian: 'Русский',
        settingsHeader: 'Настройки',
        settingsSaved: 'Настройки сохранены.',
        username: 'Имя пользователя',
        password: 'Пароль',
        confirmPassword: 'Подтвердите пароль',
        signIn: 'Войти',
        register: 'Регистрация',
        createAccount: 'Создать аккаунт!',
        welcomeBack: 'Рады видеть снова!',
        credentialsPrompt: 'Введите данные для входа:',
        registerPrompt: 'Заполните данные для регистрации:',
        placeholderUsername: 'имя пользователя',
        placeholderPassword: '••••••••',
        placeholderChooseUsername: 'выберите имя пользователя',
        placeholderRepeatPassword: 'повторите пароль',
        adminHint: 'admin / admin → админ-панель',
        selectFolder: 'Выбрать папку',
        switchAccount: 'Сменить аккаунт',
        logOut: 'Выйти из аккаунта',
        registerAccount: 'Зарегистрироваться'
    }
};

function getSavedSettings() {
    try {
        const stored = localStorage.getItem(SETTINGS_KEY);
        return stored ? { ...defaultSettings, ...JSON.parse(stored) } : { ...defaultSettings };
    } catch (error) {
        return { ...defaultSettings };
    }
}

function saveSettings(settings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...defaultSettings, ...settings }));
}

function getText(key, language) {
    return translations[language]?.[key] || translations.en[key] || key;
}

function translatePage(language) {
    document.documentElement.lang = language;

    const titleEl = document.querySelector('title[data-i18n-title]');
    if (titleEl) {
        titleEl.textContent = getText(titleEl.dataset.i18nTitle, language);
    }

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        const text = getText(key, language);
        el.textContent = text;
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.dataset.i18nPlaceholder;
        el.placeholder = getText(key, language);
    });
}

function applyTheme(theme) {
    if (theme === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.body.classList.toggle('light-theme', !prefersDark);
    } else {
        document.body.classList.toggle('light-theme', theme === 'light');
    }
}

function applyFontSize(fontSize) {
    document.body.classList.remove('font-small', 'font-medium', 'font-large');
    document.body.classList.add(`font-${fontSize}`);
}

function applySettings(settings) {
    applyTheme(settings.theme);
    applyFontSize(settings.fontSize);
    translatePage(settings.language);
}

function initSettingsForm(settings) {
    const languageSelect = document.getElementById('language');
    if (!languageSelect) {
        return;
    }

    const themeSelect = document.getElementById('theme');
    const fontSizeSelect = document.getElementById('fontSize');
    const timezoneSelect = document.getElementById('timezone');
    const saveButton = document.getElementById('saveSettings');

    languageSelect.value = settings.language;
    themeSelect.value = settings.theme;
    fontSizeSelect.value = settings.fontSize;
    timezoneSelect.value = settings.timezone;

    if (!saveButton) {
        return;
    }

    saveButton.addEventListener('click', () => {
        const newSettings = {
            language: languageSelect.value,
            theme: themeSelect.value,
            fontSize: fontSizeSelect.value,
            timezone: timezoneSelect.value,
        };

        saveSettings(newSettings);
        applySettings(newSettings);

        alert(getText('settingsSaved', newSettings.language));
    });

    if (browseButton) {
        browseButton.addEventListener('click', async () => {
            if (window.api && typeof window.api.selectFolder === 'function') {
                const folder = await window.api.selectFolder();
                if (folder) {
                    storagePathInput.value = folder;
                }
                return;
            }

            const folder = prompt(getText('selectFolder', languageSelect.value));
            if (folder) {
                storagePathInput.value = folder;
            }
        });
    }
}

function init() {
    const settings = getSavedSettings();
    applySettings(settings);
    initSettingsForm(settings);
}

document.addEventListener('DOMContentLoaded', init);
