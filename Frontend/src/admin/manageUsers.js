import API from "../services/api.js";

export default function renderManageUsers(container) {
  container.innerHTML = `
    <h2 class="text-2xl font-bold mb-4">
      Manage Users
    </h2>

    <input
      id="userSearch"
      type="text"
      placeholder="Search by name, email, or role..."
      class="border p-3 rounded w-full mb-4"
    />

    <div id="usersList"></div>
  `;

  const searchInput = container.querySelector("#userSearch");
  const usersList = container.querySelector("#usersList");

  let allUsers = [];

  function renderUsers(users) {
    usersList.innerHTML = "";

    if (!users.length) {
      usersList.innerHTML = "<p>No users found</p>";
      return;
    }

    users.forEach((user) => {
      const card = document.createElement("div");

      card.className =
        "bg-white shadow p-4 rounded mb-3";

      card.innerHTML = `
        <input
          value="${user.name}"
          class="name border p-2 rounded w-full mb-2"
        />

        <input
          value="${user.email}"
          class="email border p-2 rounded w-full mb-2"
        />

        <input
          type="password"
          placeholder="New Password (optional)"
          class="password border p-2 rounded w-full mb-2"
        />

        <select class="role border p-2 rounded w-full mb-2">
          <option value="student" ${user.role === "student" ? "selected" : ""}>
            student
          </option>

          <option value="vendor" ${user.role === "vendor" ? "selected" : ""}>
            vendor
          </option>
        </select>

        <div class="flex gap-2">
          <button class="update bg-blue-500 text-white px-4 py-2 rounded">
            Update
          </button>

          <button class="delete bg-red-500 text-white px-4 py-2 rounded">
            Delete
          </button>
        </div>
      `;

      card.querySelector(".update").onclick = async () => {
        await API.put(`/admin/users/${user._id}`, {
          name: card.querySelector(".name").value,
          email: card.querySelector(".email").value,
          role: card.querySelector(".role").value,
          password: card.querySelector(".password").value,
        });

        alert("User updated");
        loadUsers();
      };

      card.querySelector(".delete").onclick = async () => {
        if (!confirm("Delete this user permanently?")) {
          return;
        }

        await API.delete(`/admin/users/${user._id}`);

        alert("User deleted");
        loadUsers();
      };

      usersList.appendChild(card);
    });
  }

  function applySearch() {
    const keyword = searchInput.value.trim().toLowerCase();

    const filteredUsers = allUsers.filter((user) => {
      const name = user.name?.toLowerCase() || "";
      const email = user.email?.toLowerCase() || "";
      const role = user.role?.toLowerCase() || "";

      return (
        name.includes(keyword) ||
        email.includes(keyword) ||
        role.includes(keyword)
      );
    });

    renderUsers(filteredUsers);
  }

  async function loadUsers() {
    try {
      const res = await API.get("/admin/users");

      allUsers = res.data || [];

      renderUsers(allUsers);
    } catch (err) {
      usersList.innerHTML =
        "<p class='text-red-500'>Failed to load users</p>";
    }
  }

  searchInput.oninput = applySearch;

  loadUsers();
}