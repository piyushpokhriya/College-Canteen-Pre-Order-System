import { renderMenu } from "./menu.js";
import { renderOrders } from "./order.js";

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

  // ================= HEADER =================
  const header = document.createElement("header");
  header.className =
    "flex justify-between items-center bg-purple-500 text-white p-6";

  const title = document.createElement("h1");
  title.className = "text-2xl font-bold";
  title.textContent = "Vendor Dashboard";

  const logoutBtn = document.createElement("button");
  logoutBtn.className =
    "bg-white text-purple-500 px-4 py-2 rounded hover:bg-gray-200";
  logoutBtn.textContent = "Logout";

  logoutBtn.onclick = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    location.reload();
  };

  header.append(title, logoutBtn);
  root.appendChild(header);

  // ================= TABS =================
  const tabContainer = document.createElement("div");
  tabContainer.className = "flex justify-center gap-4 mt-6";

  const menuTab = document.createElement("button");
  const ordersTab = document.createElement("button");

  menuTab.textContent = "Menu";
  ordersTab.textContent = "Orders";

  const activeClass =
    "px-6 py-2 bg-purple-500 text-white rounded";
  const inactiveClass =
    "px-6 py-2 bg-gray-200 rounded";

  function setActive(tab) {
    menuTab.className =
      tab === "menu" ? activeClass : inactiveClass;
    ordersTab.className =
      tab === "orders" ? activeClass : inactiveClass;
  }

  menuTab.onclick = () => {
    setActive("menu");
    renderMenu(content);
  };

  ordersTab.onclick = () => {
    setActive("orders");
    renderOrders(content);
  };

  tabContainer.append(menuTab, ordersTab);
  root.appendChild(tabContainer);

  // ================= CONTENT =================
  const content = document.createElement("div");
  content.className = "mt-6 px-6";
  root.appendChild(content);

  // default view
  setActive("menu");
  renderMenu(content);
}