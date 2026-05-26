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
    <div class="p-4 border-b font-bold text-lg">
      Vendor Menu
    </div>

    <button id="menuBtn"
      class="w-full text-left p-3 hover:bg-gray-100">
      Menu
    </button>

    <button id="ordersBtn"
      class="w-full text-left p-3 hover:bg-gray-100">
      Orders
    </button>

    <button id="statsBtn"
      class="w-full text-left p-3 hover:bg-gray-100">
      Stats
    </button>

    <button id="shopToggleBtn"
      class="w-full text-left p-3 hover:bg-gray-100">
      Open / Close Shop
    </button>

    <hr/>

    <button id="logout"
      class="w-full text-left p-3 text-red-600 hover:bg-gray-100">
      Logout
    </button>
  `;

  document.body.appendChild(sidebar);

  // ================= CONTENT AREA =================
  const content = document.createElement("div");

  content.className = "p-6";

  root.appendChild(content);

  const statsDiv = document.createElement("div");

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
    if (e.key === "Escape") {
      closeSidebar();
    }
  });

  // ================= LOAD STATS =================
  async function loadStats() {
    try {
      const res = await API.get("/vendor/stats");

      const {
        allTime,
        thisMonth,
        today,
        yesterday,
        topSelling,
      } = res.data;

      function card(title, value, color = "") {
        return `
          <div class="bg-white shadow p-4 rounded">
            <h3>${title}</h3>

            <p class="text-2xl font-bold ${color}">
              ${value}
            </p>
          </div>
        `;
      }

      statsDiv.className = "space-y-8 p-6";

      statsDiv.innerHTML = `
        <div>
          <h2 class="text-xl font-bold mb-3">
            Top Selling Items
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            ${card(
              "Today",
              topSelling.today,
              "text-purple-600"
            )}

            ${card(
              "This Week",
              topSelling.thisWeek,
              "text-purple-600"
            )}

            ${card(
              "This Month",
              topSelling.thisMonth,
              "text-purple-600"
            )}
          </div>
        </div>

        <div>
          <h2 class="text-xl font-bold mb-3">
            Today Stats
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            ${card(
              "Today Revenue",
              `₹${today.totalRevenue}`,
              "text-blue-600"
            )}

            ${card(
              "After Discount",
              `₹${today.afterDiscountRevenue}`,
              "text-green-600"
            )}

            ${card(
              "Today Orders",
              today.totalOrders
            )}
          </div>
        </div>

        <div>
          <h2 class="text-xl font-bold mb-3">
            Yesterday Stats
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            ${card(
              "Yesterday Revenue",
              `₹${yesterday.totalRevenue}`
            )}

            ${card(
              "After Discount",
              `₹${yesterday.afterDiscountRevenue}`,
              "text-green-600"
            )}

            ${card(
              "Yesterday Orders",
              yesterday.totalOrders
            )}
          </div>
        </div>

        <div>
          <h2 class="text-xl font-bold mb-3">
            This Month Stats
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            ${card(
              "Monthly Revenue",
              `₹${thisMonth.totalRevenue}`
            )}

            ${card(
              "After Discount",
              `₹${thisMonth.afterDiscountRevenue}`,
              "text-green-600"
            )}

            ${card(
              "Monthly Orders",
              thisMonth.totalOrders
            )}
          </div>
        </div>

        <div>
          <h2 class="text-xl font-bold mb-3">
            All Time Stats
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            ${card(
              "Total Revenue",
              `₹${allTime.totalRevenue}`
            )}

            ${card(
              "After Discount",
              `₹${allTime.afterDiscountRevenue}`,
              "text-green-600"
            )}

            ${card(
              "Total Orders",
              allTime.totalOrders
            )}
          </div>
        </div>
      `;

      content.innerHTML = "";
      content.appendChild(statsDiv);

    } catch (err) {
      console.log(err);

      content.innerHTML =
        "<p class='text-red-500'>Failed to load stats</p>";
    }
  }

  // ================= MENU =================
  sidebar.querySelector("#menuBtn").onclick = () => {
    content.innerHTML = "";
    renderMenu(content);
    closeSidebar();
  };

  // ================= ORDERS =================
  sidebar.querySelector("#ordersBtn").onclick = () => {
    content.innerHTML = "";
    renderOrders(content);
    closeSidebar();
  };

  // ================= STATS =================
  sidebar.querySelector("#statsBtn").onclick = () => {
    loadStats();
    closeSidebar();
  };

  // ================= SHOP OPEN/CLOSE =================
  sidebar.querySelector("#shopToggleBtn").onclick =
    async () => {
      try {
        const res = await API.put(
          "/vendor/toggle-card"
        );

        alert(
          res.data.isActive
            ? "Shop is now OPEN"
            : "Shop is now CLOSED"
        );

        closeSidebar();

      } catch (err) {
        console.log(err);

        alert("Failed to update shop status");
      }
    };

  // ================= LOGOUT =================
  sidebar.querySelector("#logout").onclick = () => {
    localStorage.clear();
    location.reload();
  };

  // ================= DEFAULT =================
  renderMenu(content);
}