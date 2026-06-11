let allLogs = [];
const table = document.getElementById("logsTable");

async function loadLogs() {
    try {
        const response = await fetch('/api/logs');

        if (!response.ok)
            throw new Error('Failed to load logs');

        allLogs = await response.json();

        console.log(allLogs);

        renderLogs();
    }
    catch (error) {
        console.error('loadLogs failed:', error);
    }
}

function noSimilarResults() {

    if (!table) return;

    table.innerHTML = `
        <tr>
            <td colspan="6"
                style="text-align:center;padding:20px;color:#666;">
                No similar logs found.
            </td>
        </tr>
    `;
}


function renderLogs() {
    logs = [...allLogs];

    if (!table) return;

    const search = document.getElementById("logSearch")?.value?.toLowerCase() || "";

    if (search) {
        logs = logs.filter(log =>
            String(log.user || "").toLowerCase().includes(search)
        );
    }

    const filter = document.getElementById("FilterBox")?.value || "";

    if (filter === "az") {
        logs.sort((a, b) =>
            String(a.title || "")
                .localeCompare(String(b.title || ""))
        );
    }

    if (filter === "za") {
        logs.sort((a, b) =>
            String(b.title || "")
                .localeCompare(String(a.title || ""))
        );
    }

    if (logs.length === 0) {
        noSimilarResults();
        return;
    }

    table.innerHTML = "";
    if (logs.action == "Deleted task") {
        logs.forEach(element => {
            table.innerHTML += `
                <tr>
                    <td>${element.date}</td>
                    <td>${element.user}</td>
                    <td>${element.action}</td>
                    <td>${element.target}</td>
                    <td>
                        <button type="button" class="page-actions" id="restoreBtn-${element.id}" onclick = "restoreTask(${log.TargetId});">Open</button>
                    </td>
                </tr>`;
        });
    }
}

async function restoreTask(taskId) {

    const response = await fetch(
        `/api/tasks/${taskId}/restore`,
        {
            method: "PUT"
        }
    );

    if (response.ok) {
        loadLogs();
    }
}

const logSearch = document.getElementById('logSearch');
if (logSearch) logSearch.addEventListener('input', renderLogs);

document.getElementById("logSearch")?.addEventListener("input", renderLogs);
document.getElementById("FilterBox")?.addEventListener("change", renderLogs);

const filtersBtn = document.getElementById("filter-btn");
const filtersMenu = document.getElementById("filtersMenu");

if (filtersBtn && filtersMenu) {
    filtersBtn.addEventListener("click", () => {
        filtersMenu.classList.toggle("hidden");
    });
}
loadLogs();
setInterval(loadLogs, 30000);