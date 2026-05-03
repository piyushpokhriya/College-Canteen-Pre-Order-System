import { renderVendorFilter } from "./vendorFilter.js";
import { renderMenuGrid } from "./menuGrid.js";

export default function renderUser(root) {
  root.innerHTML = "";

  // ================= HEADER =================
  const header = document.createElement("header");
  header.className =
    "flex justify-between items-center bg-blue-500 text-white p-6";

  const title = document.createElement("h1");
  title.className = "text-2xl font-bold";
  title.textContent = "Canteen Menu";

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

  // ================= STATUS BAR =================
  const statusBar = document.createElement("div");
  statusBar.className = "px-6 pb-2 text-lg font-semibold";
  statusBar.textContent = "Showing All Vendors";
  root.appendChild(statusBar);

  // ================= MENU GRID =================
  const menuDiv = document.createElement("div");
  menuDiv.className =
    "grid grid-cols-1 md:grid-cols-3 gap-6 p-6";
  root.appendChild(menuDiv);

  // ================= INIT =================
  renderVendorFilter(filterDiv, (vendorId, vendor) => {

    if (vendorId === "all") {
      statusBar.textContent = "Showing All Vendors";
      statusBar.className = "px-6 pb-2 text-lg font-semibold";
    } else {
      statusBar.textContent =
        vendor.shopName + (vendor.isOpen ? " (Open)" : " (Closed)");

      statusBar.className =
        "px-6 pb-2 text-lg font-semibold " +
        (vendor.isOpen ? "text-green-600" : "text-red-500");
    }

    renderMenuGrid(menuDiv, vendorId);
  });

  // default load
  renderMenuGrid(menuDiv);
}