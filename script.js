const STORAGE_KEY = "mini-hackathon-task-manager";

let tasks = loadTasks();
let elements = {};

function loadTasks() {
    try {
        const savedTasks = localStorage.getItem(STORAGE_KEY);
        return savedTasks ? JSON.parse(savedTasks) : [];
    } catch (error) {
        return [];
    }
}

function saveTasks() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
        // Ignore storage errors so the app keeps working even without persistence.
    }
}

function createTaskId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
        return window.crypto.randomUUID();
    }

    return String(Date.now() + Math.floor(Math.random() * 1000));
}

function formatTaskCount(count) {
    return `${count} ${count === 1 ? "detyre" : "detyra"}`;
}

function formatTaskDate(dateString) {
    const date = new Date(dateString);

    return new Intl.DateTimeFormat("sq-AL", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
}

function setFormMessage(message, type = "") {
    elements.formMessage.textContent = message;
    elements.formMessage.className = "form-message";

    if (type) {
        elements.formMessage.classList.add(`is-${type}`);
    }
}

function updateDashboard() {
    const total = tasks.length;

    elements.totalTasks.textContent = total;
    elements.taskBadge.textContent = formatTaskCount(total);
    elements.lastUpdate.textContent = total
        ? `Detyra e fundit u shtua me ${formatTaskDate(tasks[0].createdAt)}`
        : "Lista eshte bosh";

    elements.emptyState.classList.toggle("is-hidden", total > 0);
}

function createTaskElement(task) {
    const item = document.createElement("li");
    item.className = "task-item";

    const row = document.createElement("div");
    row.className = "task-row";

    const content = document.createElement("div");

    const title = document.createElement("p");
    title.className = "task-title";
    title.textContent = task.text;

    const meta = document.createElement("p");
    meta.className = "task-meta";
    meta.textContent = `Shtuar: ${formatTaskDate(task.createdAt)}`;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.dataset.taskId = task.id;
    deleteButton.textContent = "Delete";

    content.append(title, meta);
    row.append(content, deleteButton);
    item.appendChild(row);

    return item;
}

function renderTasks() {
    elements.taskList.innerHTML = "";

    tasks.forEach((task) => {
        elements.taskList.appendChild(createTaskElement(task));
    });

    updateDashboard();
}

function addTask(taskText) {
    const cleanTask = taskText.trim();

    if (!cleanTask) {
        setFormMessage("Shkruaj nje detyre para se ta shtosh.", "error");
        elements.taskInput.focus();
        return false;
    }

    const task = {
        id: createTaskId(),
        text: cleanTask,
        createdAt: new Date().toISOString(),
    };

    tasks.unshift(task);
    saveTasks();
    renderTasks();
    setFormMessage(`Detyra "${cleanTask}" u shtua me sukses.`, "success");
    elements.taskInput.value = "";
    elements.taskInput.focus();

    return true;
}

function deleteTask(taskId) {
    tasks = tasks.filter((task) => task.id !== taskId);
    saveTasks();
    renderTasks();
    setFormMessage("Detyra u fshi nga lista.", "success");
}

function bootTaskManager() {
    elements = {
        form: document.getElementById("task-form"),
        taskInput: document.getElementById("task-input"),
        taskList: document.getElementById("task-list"),
        formMessage: document.querySelector("[data-form-message]"),
        totalTasks: document.querySelector("[data-total-tasks]"),
        lastUpdate: document.querySelector("[data-last-update]"),
        taskBadge: document.querySelector("[data-task-badge]"),
        emptyState: document.querySelector("[data-empty-state]"),
    };

    if (
        !elements.form ||
        !elements.taskInput ||
        !elements.taskList ||
        !elements.formMessage ||
        !elements.totalTasks ||
        !elements.lastUpdate ||
        !elements.taskBadge ||
        !elements.emptyState
    ) {
        return;
    }

    renderTasks();

    elements.form.addEventListener("submit", (event) => {
        event.preventDefault();
        addTask(elements.taskInput.value);
    });

    elements.taskList.addEventListener("click", (event) => {
        const deleteButton = event.target.closest("[data-task-id]");

        if (!deleteButton) {
            return;
        }

        deleteTask(deleteButton.dataset.taskId);
    });
}

document.addEventListener("DOMContentLoaded", bootTaskManager);
