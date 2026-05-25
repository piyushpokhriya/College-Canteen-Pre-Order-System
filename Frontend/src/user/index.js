import { renderVendorFilter } from "./vendorFilter.js";
import { renderMenuGrid } from "./menuGrid.js";
import renderCart from "./cart.js";
import renderOrders from "./orders.js";

export default function renderUser(root) {
  root.innerHTML = "";

  // ================= HEADER =================
  const header = document.createElement("header");
  header.className =
    "flex justify-between items-center bg-blue-500 text-white p-6";

  const title = document.createElement("h1");
  title.className = "text-2xl font-bold";
  title.textContent = "User Dashboard";

  const logoutBtn = document.createElement("button");
  logoutBtn.className =
    "bg-white text-blue-500 px-4 py-2 rounded";
  logoutBtn.textContent = "Logout";

  logoutBtn.onclick = () => {
    localStorage.clear();
    location.reload();
  };

  header.append(title, logoutBtn);
  root.appendChild(header);

  // ================= FILTER =================
  const filterDiv = document.createElement("div");
  filterDiv.className = "p-6";
  root.appendChild(filterDiv);

  // ================= STATUS =================
  const statusBar = document.createElement("div");
  statusBar.className =
    "px-6 pb-2 text-lg font-semibold";
  statusBar.textContent = "Showing All Vendors";
  root.appendChild(statusBar);

  // ================= NAV =================
  const navBar = document.createElement("div");
  navBar.className = "flex gap-3 px-6 mb-4";

  const menuBtn = document.createElement("button");
  const cartBtn = document.createElement("button");
  const ordersBtn = document.createElement("button"); // ✅ NEW

  menuBtn.textContent = "Menu";
  cartBtn.textContent = "Cart";
  ordersBtn.textContent = "Orders";

  const active =
    "px-4 py-2 bg-blue-500 text-white rounded";
  const inactive =
    "px-4 py-2 bg-gray-200 rounded";

  menuBtn.className = active;
  cartBtn.className = inactive;
  ordersBtn.className = inactive;

  navBar.append(menuBtn, cartBtn, ordersBtn);
  root.appendChild(navBar);

  // ================= MAIN CONTENT =================
  const menuDiv = document.createElement("div");
  menuDiv.className =
    "grid grid-cols-1 md:grid-cols-3 gap-6 p-6";
  root.appendChild(menuDiv);

  const cartDiv = document.createElement("div");
  cartDiv.className = "p-6 hidden";
  root.appendChild(cartDiv);

  // ================= LOAD MENU =================
  function loadMenu(vendorId = "all", vendor = null) {
    menuDiv.innerHTML = "";

    statusBar.className =
      "px-6 pb-2 text-lg font-semibold";

    if (vendorId === "all") {
      statusBar.textContent =
        "Showing All Vendors";
    } else {
      statusBar.textContent =
        vendor.shopName +
        (vendor.isOpen
          ? " (Open)"
          : " (Closed)");

      statusBar.className += vendor.isOpen
        ? " text-green-600"
        : " text-red-500";
    }

    renderMenuGrid(menuDiv, vendorId);
  }

  // ================= FILTER INIT =================
  renderVendorFilter(filterDiv, (vendorId, vendor) => {
    loadMenu(vendorId, vendor);
  });

  // ================= TAB: MENU =================
  menuBtn.onclick = () => {
    menuBtn.className = active;
    cartBtn.className = inactive;
    ordersBtn.className = inactive;

    menuDiv.classList.remove("hidden");
    cartDiv.classList.add("hidden");

    loadMenu();
  };

  // ================= TAB: CART =================
  cartBtn.onclick = () => {
    cartBtn.className = active;
    menuBtn.className = inactive;
    ordersBtn.className = inactive;

    menuDiv.classList.add("hidden");
    cartDiv.classList.remove("hidden");

    cartDiv.innerHTML = "";
    renderCart(cartDiv);
  };

  // ================= TAB: ORDERS =================
  ordersBtn.onclick = () => {
    ordersBtn.className = active;
    menuBtn.className = inactive;
    cartBtn.className = inactive;

    menuDiv.classList.add("hidden");
    cartDiv.classList.add("hidden");

    menuDiv.innerHTML = "";
    cartDiv.innerHTML = "";

    renderOrders(menuDiv);
  };

  // ================= DEFAULT LOAD =================
  loadMenu();
}