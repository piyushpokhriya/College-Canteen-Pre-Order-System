import { renderMenu } from "./menu.js";
import renderOrders from "./order.js";
import API from "../services/api.js";

export default function renderVendor(root) {
  root.innerHTML = "";

  // ================= AUTH CHECK =================
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== "vendor") {
    alert("Unauthorized access");
    location.reload();
    return;
  }

  // ================= STATE =================
  let sidebarOpen = false;

  // ================= HEADER =================
  const header = document.createElement("div");
  header.className =
    "flex justify-between items-center bg-purple-600 text-white p-4";

  const menuIcon = document.createElement("button");
  menuIcon.innerHTML = "☰";
  menuIcon.className = "text-2xl font-bold";

  const title = document.createElement("h1");
  title.className = "text-xl font-bold";
  title.textContent = "Vendor Dashboard";

  const rightSpace = document.createElement("div");

  header.append(menuIcon, title, rightSpace);
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
    <div class="p-4 border-b font-bold text-lg">Vendor Menu</div>

    <button id="menuBtn" class="w-full text-left p-3 hover:bg-gray-100">
      Menu
    </button>

    <button id="ordersBtn" class="w-full text-left p-3 hover:bg-gray-100">
      Orders
    </button>

    <button id="statsBtn" class="w-full text-left p-3 hover:bg-gray-100">
      Stats
    </button>

    <hr/>

    <button id="logout" class="w-full text-left p-3 text-red-600 hover:bg-gray-100">
      Logout
    </button>

    <button id="deleteAcc" class="w-full text-left p-3 text-black hover:bg-gray-100">
      Delete Account
    </button>
  `;

  document.body.appendChild(sidebar);

  // ================= CONTENT AREA =================
  const content = document.createElement("div");
  content.className = "p-6";
  root.appendChild(content);

  const statsDiv = document.createElement("div");
  statsDiv.className = "grid grid-cols-1 md:grid-cols-3 gap-6 p-6";

  // ================= SIDEBAR TOGGLE =================
  function openSidebar() {
    sidebarOpen = true;
    sidebar.classList.remove("-translate-x-full");
    overlay.classList.remove("hidden");
  }

  function closeSidebar() {
    sidebarOpen = false;
    sidebar.classList.add("-translate-x-full");
    overlay.classList.add("hidden");
  }

  menuIcon.onclick = () => {
    sidebarOpen ? closeSidebar() : openSidebar();
  };

  overlay.onclick = closeSidebar;

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeSidebar();
  });

  // ================= LOAD STATS =================
  async function loadStats() {
    try {
      const res = await API.get("/vendor/stats");
      const { totalRevenue, afterDiscountRevenue, totalOrders } =
        res.data;

      statsDiv.innerHTML = `
        <div class="bg-white shadow p-4 rounded">
          <h3>Total Revenue</h3>
          <p class="text-xl">₹${totalRevenue}</p>
        </div>

        <div class="bg-white shadow p-4 rounded">
          <h3>After Discount</h3>
          <p class="text-xl text-green-600">₹${afterDiscountRevenue}</p>
        </div>

        <div class="bg-white shadow p-4 rounded">
          <h3>Total Orders</h3>
          <p class="text-xl">${totalOrders}</p>
        </div>
      `;

      content.innerHTML = "";
      content.appendChild(statsDiv);
    } catch (err) {
      content.innerHTML = "Failed to load stats";
    }
  }

  // ================= EVENTS =================
  sidebar.querySelector("#menuBtn").onclick = () => {
    content.innerHTML = "";
    renderMenu(content);
    closeSidebar();
  };

  sidebar.querySelector("#ordersBtn").onclick = () => {
    content.innerHTML = "";
    renderOrders(content);
    closeSidebar();
  };

  sidebar.querySelector("#statsBtn").onclick = () => {
    loadStats();
    closeSidebar();
  };

  sidebar.querySelector("#logout").onclick = () => {
    localStorage.clear();
    location.reload();
  };

  sidebar.querySelector("#deleteAcc").onclick = async () => {
    const ok = confirm("Delete account permanently?");
    if (!ok) return;

    try {
      await API.delete("/auth/delete-account");
      localStorage.clear();
      location.reload();
    } catch (err) {
      alert("Delete failed");
    }
  };

  // ================= DEFAULT =================
  renderMenu(content);
}