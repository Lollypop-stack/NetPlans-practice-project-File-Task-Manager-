let allFiles = [];

async function loadFiles() {
    try {
        const response = await fetch('/api/files');
        if (!response.ok) throw new Error('Failed to load files');

        allFiles = await response.json();
        renderFiles();
    } catch (error) {
        console.error('loadFiles failed:', error);
    }
}

function renderFiles() {
    const table = document.getElementById('filesTable');
    const search = document.getElementById('fileSearch')?.value?.toLowerCase() || '';

    if (!table) return;

    const filtered = allFiles.filter((file) => String(file.fileName || '').toLowerCase().includes(search));
    table.innerHTML = '';

    filtered.forEach((file) => {
        table.innerHTML += `
            <tr>
                <td>${file.fileName ?? ''}</td>
                <td>${file.version ?? ''}</td>
                <td>${file.lastModified ? new Date(file.lastModified).toLocaleString() : ''}</td>
                <td>${file.modifiedBy ?? ''}</td>
                <td><button type="button">Open</button></td>
            </tr>`;
    });
}

const fileSearch = document.getElementById('fileSearch');
if (fileSearch) fileSearch.addEventListener('input', renderFiles);

loadFiles();
setInterval(loadFiles, 30000);