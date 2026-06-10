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

const table = document.getElementById('filesTable');

function noSimilarResults() {
    const files = document.getElementById('filesTable');
    if (!table) return;
    table.innerHTML = `
        <tr>
            <td colspan="5" style="text-align: center; padding: 20px; color: #666;">No similar files found.</td>
        </tr>
    `;
}

function renderFiles() {
    let files = [...allFiles];

    const search = document.getElementById('fileSearch')?.value?.toLowerCase() || '';

    if (search) {
        files = files.filter(file =>
            String(file.fileName || '').toLowerCase().includes(search));
    }

    if (files.length === 0) {
        noSimilarResults();
        return;
    }
    
    const filter = document.getElementById("FilterBox")?.value || "";
    if (!table) return;
    if (files.length === 0) {
        noSimilarResults();
        return;
    }
    if (filter === "az") {
        files.sort((a, b) => a.fileName.localeCompare(b.fileName));
    }
    if (filter === "za") {
        files.sort((a, b) => b.fileName.localeCompare(a.fileName));
    }
    table.innerHTML = '';
    files.forEach((file) => { table.innerHTML += `
        <tr>
                <td>${file.fileName ?? ''}</td>
                <td>${file.version ?? ''}</td>
                <td>${file.lastModified ? new Date(file.lastModified).toLocaleString() : ''}</td>
                <td>${file.modifiedBy ?? ''}</td>
                <td><button type="button">Open</button></td>
            </tr> `; });
}

const fileSearch = document.getElementById('fileSearch');
if (fileSearch) fileSearch.addEventListener('input', renderFiles);


const filtersBtn = document.getElementById("filter-btn");
const filtersMenu = document.getElementById("filtersMenu");

if (filtersBtn && filtersMenu) {
    filtersBtn.addEventListener("click", () => {
        filtersMenu.classList.toggle("hidden");
    });
}

document.getElementById("FilterBox")?.addEventListener("change", renderFiles);

loadFiles();
setInterval(loadFiles, 30000);