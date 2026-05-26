import API from "../services/api.js";
import renderTimeSlots from "./timeSlots.js";
import renderManageUsers from "./manageUsers.js";
import renderManageVendors from "./manageVendors.js";

export default function renderAdmin(root) {
  root.innerHTML = "";

  let sidebarOpen = false;

  const header = document.createElement("div");
  header.className =
    "flex justify-between items-center bg-red-600 text-white p-4";

  const menuBtn = document.createElement("button");
  menuBtn.innerHTML = "☰";
  menuBtn.className = "text-2xl font-bold";

  const title = document.createElement("h1");
  title.className = "text-xl font-bold";
  title.textContent = "Admin Dashboard";

  header.append(menuBtn, title);
  root.appendChild(header);

  const overlay = document.createElement("div");
  overlay.className =
    "fixed inset-0 bg-black bg-opacity-30 hidden z-40";

  document.body.appendChild(overlay);

  const sidebar = document.createElement("div");

  sidebar.className =
    "fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform -translate-x-full transition-transform duration-300 z-50";

  sidebar.innerHTML = `
    <div class="p-4 border-b font-bold text-lg">
      Admin Menu
    </div>

    <button id="dashboardBtn"
      class="w-full text-left p-3 hover:bg-gray-100">
      Dashboard
    </button>

    <button id="vendorsBtn"
      class="w-full text-left p-3 hover:bg-gray-100">
      Pending Vendors
    </button>

    <button id="revenueBtn"
      class="w-full text-left p-3 hover:bg-gray-100">
      Vendor Revenue
    </button>

    <button id="manageUsersBtn"
      class="w-full text-left p-3 hover:bg-gray-100">
      Manage Users
    </button>

    <button id="manageVendorsBtn"
      class="w-full text-left p-3 hover:bg-gray-100">
      Manage Vendors
    </button>

    <button id="timeSlotBtn"
      class="w-full text-left p-3 hover:bg-gray-100">
      Block Order Time
    </button>

    <hr>

    <button id="logoutBtn"
      class="w-full text-left p-3 text-red-600 hover:bg-gray-100">
      Logout
    </button>
  `;

  document.body.appendChild(sidebar);

  const content = document.createElement("div");
  content.className = "p-6";
  root.appendChild(content);

  function openSidebar() {
    sidebar.classList.remove("-translate-x-full");
    overlay.classList.remove("hidden");
    sidebarOpen = true;
  }

  function closeSidebar() {
    sidebar.classList.add("-translate-x-full");
    overlay.classList.add("hidden");
    sidebarOpen = false;
  }

  menuBtn.onclick = () => {
    sidebarOpen ? closeSidebar() : openSidebar();
  };

  overlay.onclick = closeSidebar;

  async function loadDashboard() {
    try {
      const res = await API.get("/admin/stats");
      const data = res.data;

      content.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-white shadow p-4 rounded">
            <h3>Total Vendors</h3>
            <p class="text-2xl font-bold">
              ${data.totalVendors}
            </p>
          </div>

          <div class="bg-white shadow p-4 rounded">
            <h3>Pending Vendors</h3>
            <p class="text-2xl font-bold text-orange-500">
              ${data.pendingVendors}
            </p>
          </div>

          <div class="bg-white shadow p-4 rounded">
            <h3>Total Orders</h3>
            <p class="text-2xl font-bold">
              ${data.totalOrders}
            </p>
          </div>

          <div class="bg-white shadow p-4 rounded">
            <h3>Total Revenue</h3>
            <p class="text-2xl font-bold text-green-600">
              ₹${data.totalRevenue}
            </p>
          </div>
        </div>

        <div class="mt-8 bg-white shadow rounded p-5">
          <h2 class="text-xl font-bold mb-3">
            Admin Overview
          </h2>

          <p class="text-gray-600 mb-4">
            Use the sidebar to approve vendors, manage users and vendors, view vendor revenue, and block ordering time slots.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-gray-100 p-4 rounded">
              <h3 class="font-bold">Vendor Approval</h3>
              <p class="text-sm text-gray-600">
                Approve pending vendors from your college.
              </p>
            </div>

            <div class="bg-gray-100 p-4 rounded">
              <h3 class="font-bold">User & Vendor Management</h3>
              <p class="text-sm text-gray-600">
                Update or delete users and vendor shops.
              </p>
            </div>

            <div class="bg-gray-100 p-4 rounded">
              <h3 class="font-bold">Order Control</h3>
              <p class="text-sm text-gray-600">
                Block order placement during selected time slots.
              </p>
            </div>
          </div>
        </div>
      `;
    } catch (err) {
      console.log(err);
      content.innerHTML =
        "<p class='text-red-500'>Failed to load dashboard</p>";
    }
  }

  async function loadVendors() {
    try {
      const res = await API.get("/admin/vendors/pending");
      const vendors = res.data;

      content.innerHTML =
        "<h2 class='text-xl font-bold mb-4'>Pending Vendors</h2>";

      if (!vendors.length) {
        content.innerHTML += "<p>No pending vendors</p>";
        return;
      }

      vendors.forEach((v) => {
        const card = document.createElement("div");
        card.className =
          "bg-white shadow p-4 rounded mb-3";

        card.innerHTML = `
          <p><b>Shop:</b> ${v.shopName}</p>
          <p><b>Owner:</b> ${v.owner?.name}</p>
          <p><b>Email:</b> ${v.owner?.email}</p>
        `;

        const btn = document.createElement("button");
        btn.className =
          "bg-green-500 text-white px-4 py-2 mt-3 rounded";
        btn.textContent = "Approve";

        btn.onclick = async () => {
          await API.put(`/admin/vendors/approve/${v._id}`);
          loadVendors();
        };

        card.appendChild(btn);
        content.appendChild(card);
      });
    } catch (err) {
      content.innerHTML = "Failed to load vendors";
    }
  }

  async function loadRevenue() {
    try {
      const res = await API.get("/admin/stats");
      const data = res.data;

      content.innerHTML = `
        <h2 class="text-2xl font-bold mb-6">
          Vendor Revenue
        </h2>
      `;

      const vendors = data.vendors || [];

      if (!vendors.length) {
        content.innerHTML += "<p>No vendors found</p>";
        return;
      }

      vendors.forEach((vendor) => {
        const card = document.createElement("div");
        card.className =
          "bg-white shadow rounded p-5 mb-5";

        card.innerHTML = `
          <h3 class="text-xl font-bold mb-4">
            ${vendor.shopName}
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="bg-gray-100 p-4 rounded">
              <h4>Total Revenue</h4>
              <p class="text-xl font-bold text-green-600">
                ₹${vendor.totalRevenue}
              </p>
            </div>

            <div class="bg-gray-100 p-4 rounded">
              <h4>This Month</h4>
              <p class="text-xl font-bold text-blue-600">
                ₹${vendor.monthlyRevenue}
              </p>
            </div>

            <div class="bg-gray-100 p-4 rounded">
              <h4>Today</h4>
              <p class="text-xl font-bold text-purple-600">
                ₹${vendor.todayRevenue}
              </p>
            </div>

            <div class="bg-gray-100 p-4 rounded">
              <h4>Total Orders</h4>
              <p class="text-xl font-bold">
                ${vendor.totalOrders}
              </p>
            </div>
          </div>
        `;

        content.appendChild(card);
      });
    } catch (err) {
      console.log(err);
      content.innerHTML = "Failed to load revenue";
    }
  }

  sidebar.querySelector("#dashboardBtn").onclick = () => {
    loadDashboard();
    closeSidebar();
  };

  sidebar.querySelector("#vendorsBtn").onclick = () => {
    loadVendors();
    closeSidebar();
  };

  sidebar.querySelector("#revenueBtn").onclick = () => {
    loadRevenue();
    closeSidebar();
  };

  sidebar.querySelector("#manageUsersBtn").onclick = () => {
    renderManageUsers(content);
    closeSidebar();
  };

  sidebar.querySelector("#manageVendorsBtn").onclick = () => {
    renderManageVendors(content);
    closeSidebar();
  };

  sidebar.querySelector("#timeSlotBtn").onclick = () => {
    renderTimeSlots(content);
    closeSidebar();
  };

  sidebar.querySelector("#logoutBtn").onclick = () => {
    localStorage.clear();
    location.reload();
  };

  loadDashboard();
}