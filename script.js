const appState = {
    users: ["Ardit", "Elira", "Besa", "Jon", "Sara"],
};

function updateUserCount(badgeElement) {
    if (!badgeElement) {
        return;
    }

    const total = appState.users.length;
    badgeElement.textContent = `${total} ${total === 1 ? "user" : "users"}`;
}

function renderUsers(listElement) {
    if (!listElement) {
        return;
    }

    listElement.innerHTML = "";

    appState.users.forEach((name, index) => {
        const listItem = document.createElement("li");
        listItem.className = "user-item";
        listItem.innerHTML = `
            <div>
                <div class="user-item-name">${name}</div>
                <div class="user-item-meta">User #${index + 1}</div>
            </div>
            <button type="button" data-delete-user="${index}">Delete</button>
        `;
        listElement.appendChild(listItem);
    });
}

function addUser(inputElement, listElement, badgeElement) {
    const nextUser = inputElement.value.trim();

    if (!nextUser) {
        inputElement.focus();
        return;
    }

    appState.users.push(nextUser);
    inputElement.value = "";
    renderUsers(listElement);
    updateUserCount(badgeElement);
    inputElement.focus();
}

function deleteUser(userIndex, listElement, badgeElement) {
    appState.users = appState.users.filter((_, index) => index !== userIndex);
    renderUsers(listElement);
    updateUserCount(badgeElement);
}

function bootUserDashboard() {
    const listElement = document.querySelector("[data-user-list]");
    const inputElement = document.querySelector("[data-user-input]");
    const addButton = document.querySelector("[data-add-user]");
    const badgeElement = document.querySelector("[data-user-count]");

    if (!listElement || !inputElement || !addButton) {
        return;
    }

    renderUsers(listElement);
    updateUserCount(badgeElement);

    addButton.addEventListener("click", () => {
        addUser(inputElement, listElement, badgeElement);
    });

    inputElement.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            addUser(inputElement, listElement, badgeElement);
        }
    });

    listElement.addEventListener("click", (event) => {
        const deleteButton = event.target.closest("[data-delete-user]");

        if (!deleteButton) {
            return;
        }

        deleteUser(Number(deleteButton.dataset.deleteUser), listElement, badgeElement);
    });
}

document.addEventListener("DOMContentLoaded", bootUserDashboard);
