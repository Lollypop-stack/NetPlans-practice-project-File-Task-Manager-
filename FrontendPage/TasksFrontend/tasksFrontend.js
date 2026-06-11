let allTasks = [];

const table = document.getElementById("tasksTable");

async function loadTasks() {
    try {
        const response = await fetch("/api/tasks");

        if (!response.ok) {
            throw new Error("Failed to load tasks");
        }

        allTasks = await response.json();

        renderTasks();

    } catch (error) {
        console.error("loadTasks failed:", error);
    }
}

async function changeStatus(taskId, newStatus) {
    try {
        const response = await fetch(`/api/tasks/${taskId}/status`,
        {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                status: newStatus
            })
        });

        if (response.ok) {
            loadTasks();
            const menu = document.getElementById(`statusList-${taskId}`);
            menu?.classList.add("hidden");
        }
    }
    catch (error) {
        console.error("changeStatus failed:", error);
    }
}

function noSimilarResults() {

    if (!table) return;

    table.innerHTML = `
        <tr>
            <td colspan="6"
                style="text-align:center;padding:20px;color:#666;">
                No similar tasks found.
            </td>
        </tr>
    `;
}

function statusColor(status) {
    switch (status) {
        case "Completed":
            return "#22c55e";
        case "In Progress":
              return "#c5c222";
        case "Abandoned":
            return "#6b7280";
        default:
            return "#6b7280";
    }
}  

function renderTasks() {

    if (!table) return;

    let tasks = [...allTasks];

    const search =
        document
            .getElementById("taskSearch")
            ?.value
            ?.toLowerCase()
        || "";

    if (search) {
        tasks = tasks.filter(task =>
            String(task.title || "")
                .toLowerCase()
                .includes(search)
        );
    }

    const filter =
        document
            .getElementById("FilterBox")
            ?.value
        || "";

    if (filter === "az") {
        tasks.sort((a, b) =>
            String(a.title || "")
                .localeCompare(String(b.title || ""))
        );
    }

    if (filter === "za") {
        tasks.sort((a, b) =>
            String(b.title || "")
                .localeCompare(String(a.title || ""))
        );
    }

    if (tasks.length === 0) {
        noSimilarResults();
        return;
    }

    table.innerHTML = "";

    tasks.forEach(task => {

        table.innerHTML += `
            <tr>
                <td>${task.title ?? ""}</td>
                <td>${task.fileName ?? ""}</td>
                <td>${task.assignedUser ?? ""}</td>
                <td>
                    <span class="status-badge" style="background-color: ${statusColor(task.status)}; padding: 8px 12px; border-radius: 10px; color: white;">
                        ${task.status}
                    </span>
                </td>
                <td>
                    ${task.deadline
                ? new Date(task.deadline).toLocaleString()
                : ""}
                </td>
                <td class="action-buttons">
                    <button class="status-btn" id="statusBtn" onclick="toggleStatus(${task.id})"  data-i18n="changeStatusButton">Change Status</button>
                    <div class="statusList hidden" id="statusList-${task.id}">
                        <select onchange="changeStatus(${task.id}, this.value)">
                            <option value="Abandoned" ${task.status === "Abandoned" ? "selected" : ""}>Abandoned</option>
                            <option value="In Progress" ${task.status === "In Progress" ? "selected" : ""}">In Progress</option>
                            <option value="Completed" ${task.status === "Completed" ? "selected" : ""}>Completed</option>
                        </select>
                    </div>
                    <button class="delete-btn" id="deleteBtn-${task.id}" onclick="deleteTask(${task.id})" data-i18n="deleteButton">Delete</button>
                </td>
            </tr>
        `;
    });
}

function toggleStatus(taskId) {
    const statusList = document.getElementById(`statusList-${taskId}`);

    if (statusList) {
        statusList.classList.toggle("hidden");
    }
}


async function deleteTask(taskId) {
    if (!confirm("Delete this task?")) {
        return;
    }
    const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE"
    });

    if (response.ok) {
        loadTasks();
        
    }else if(!response.ok){
        alert("Faliled to delete task!");
        return;
    }
}

document.getElementById("taskSearch")?.addEventListener("input", renderTasks);

document.getElementById("FilterBox")?.addEventListener("change", renderTasks);

const filtersBtn = document.getElementById("filter-btn");
const filtersMenu = document.getElementById("filtersMenu");

if (filtersBtn && filtersMenu) {
    filtersBtn.addEventListener("click", () => {
        filtersMenu.classList.toggle("hidden");
    });
}


loadTasks();

setInterval(loadTasks, 30000);