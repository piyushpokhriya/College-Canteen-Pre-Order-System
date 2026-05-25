import API from "../services/api.js";
import renderAdminOrders from "./orders.js";

export default function renderAdmin(root) {
  root.innerHTML = "";

  let sidebarOpen = false;

  // ================= HEADER =================
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

  // ================= OVERLAY =================
  const overlay = document.createElement("div");
  overlay.className =
    "fixed inset-0 bg-black bg-opacity-30 hidden z-40";

  document.body.appendChild(overlay);

  // ================= SIDEBAR =================
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

    <button id="ordersBtn"
      class="w-full text-left p-3 hover:bg-gray-100">
      Orders
    </button>

    <button id="vendorsBtn"
      class="w-full text-left p-3 hover:bg-gray-100">
      Pending Vendors
    </button>

    <button id="revenueBtn"
      class="w-full text-left p-3 hover:bg-gray-100">
      Vendor Revenue
    </button>

    <hr>

    <button id="logoutBtn"
      class="w-full text-left p-3 text-red-600 hover:bg-gray-100">
      Logout
    </button>
  `;

  document.body.appendChild(sidebar);

  // ================= CONTENT =================
  const content = document.createElement("div");
  content.className = "p-6";

  root.appendChild(content);

  // ================= SIDEBAR FUNCTIONS =================
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

  // ================= DASHBOARD =================
  async function loadDashboard() {
  try {
    const res = await API.get("/admin/stats");

    const data = res.data;

    let vendorRevenueHTML = "";

    Object.values(data.vendorRevenueMap || {}).forEach((vendor) => {
      vendorRevenueHTML += `
        <div class="flex justify-between border-b py-2">
          <span>${vendor.shopName}</span>
          <span class="font-bold text-green-600">
            ₹${vendor.revenue}
          </span>
        </div>
      `;
    });

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

        <h2 class="text-xl font-bold mb-4">
          Vendor Revenue
        </h2>

        ${
          vendorRevenueHTML || `
          <div class="text-gray-500">
            No orders yet. Revenue will appear after first order.
          </div>
`
        }

      </div>

    `;
  } catch (err) {
    console.log(err);

    content.innerHTML =
      "<p class='text-red-500'>Failed to load dashboard</p>";
  }
}

  // ================= PENDING VENDORS =================
  async function loadVendors() {
    try {
      const res = await API.get("/admin/vendors/pending");

      const vendors = res.data;

      content.innerHTML = "<h2 class='text-xl font-bold mb-4'>Pending Vendors</h2>";

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
          await API.put(
            `/admin/vendors/approve/${v._id}`
          );

          loadVendors();
        };

        card.appendChild(btn);

        content.appendChild(card);
      });

    } catch (err) {
      content.innerHTML = "Failed to load vendors";
    }
  }

  // ================= REVENUE =================
  async function loadRevenue() {
    try {
      const res = await API.get("/admin/stats");

      const data = res.data;

      content.innerHTML = `
        <h2 class="text-xl font-bold mb-4">
          Vendor Revenue
        </h2>
      `;

      if (!data.vendorStats) return;

      data.vendorStats.forEach((vendor) => {
        const revenue =
          data.vendorRevenueMap?.[vendor._id] || 0;

        const card = document.createElement("div");

        card.className =
          "bg-white shadow p-4 rounded mb-3";

        card.innerHTML = `
          <p><b>Shop:</b> ${vendor.shopName}</p>
          <p><b>Status:</b> ${vendor.status}</p>
          <p class="text-green-600 font-bold">
            Revenue: ₹${revenue}
          </p>
        `;

        content.appendChild(card);
      });

    } catch (err) {
      content.innerHTML = "Failed to load revenue";
    }
  }

  // ================= EVENTS =================
  sidebar.querySelector("#dashboardBtn").onclick = () => {
    loadDashboard();
    closeSidebar();
  };

  sidebar.querySelector("#ordersBtn").onclick = () => {
    renderAdminOrders(content);
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

  sidebar.querySelector("#logoutBtn").onclick = () => {
    localStorage.clear();
    location.reload();
  };

  // ================= DEFAULT =================
  loadDashboard();
}