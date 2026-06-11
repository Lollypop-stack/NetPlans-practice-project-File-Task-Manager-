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

    let logs = [...allLogs];

    if (!table) return;

    const search =
        document.getElementById("logSearch")
            ?.value
            ?.toLowerCase() || "";

    if (search) {
        logs = logs.filter(log =>
            String(log.user || "")
                .toLowerCase()
                .includes(search)
        );
    }
    const restoredTaskIds = logs
        .filter(log => log.action === "Restored task")
        .map(log => log.targetId);

    const filter = document.getElementById("FilterBox")?.value || "";

    if (filter === "az") {
        logs.sort((a, b) =>
            String(a.target || "")
                .localeCompare(String(b.target || ""))
        );
    }

    if (filter === "za") {
        logs.sort((a, b) =>
            String(b.target || "")
                .localeCompare(String(a.target || ""))
        );
    }

    if (logs.length === 0) {
        noSimilarResults();
        return;
    }
    logs.sort((a, b) =>
    new Date(b.date) - new Date(a.date)
);

    table.innerHTML = "";

    logs.forEach(log => {

        const isRestored =
            log.action === "Deleted task" &&
            restoredTaskIds.includes(log.targetId);

        table.innerHTML += `
        <tr>
            <td>${log.date}</td>
            <td>${log.user}</td>
            <td>${log.action}</td>
            <td>${log.target}</td>
            <td>
                ${log.action === "Deleted task"
                ? `
                        <button
                            class="page-actions restore-button ${isRestored ? "hidden" : ""}"
                            onclick="restoreTask(${log.targetId})"
                            ${isRestored ? "disabled" : ""}>Restore
                        </button>
                    `
                : ""
            }

                <button
                    class="delete-btn"
                    onclick="deleteLogs(${log.id})">
                    Delete
                </button>
            </td>
        </tr>
    `;
    });
}

async function deleteLogs(id) {
    if (!confirm("Delete this task?")) {
        return;
    }
    console.log(`/api/logs/${id}`);
    const response = await fetch(`/api/logs/${id}`, {
        method: "DELETE"
    });

    if (response.ok) {
        loadLogs();

    } else if (!response.ok) {
        alert("Faliled to delete log!");
        return;
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