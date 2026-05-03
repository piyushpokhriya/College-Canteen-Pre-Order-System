import { createIcons, GraduationCap, Store, Shield } from "lucide";

export function renderRoleCards(container, root) {
  container.innerHTML = "";

  const roles = [
    {
      label: "Student",
      description: "Browse menu, place orders, and track food.",
      color: "bg-blue-100",
      icon: "graduation-cap",
      module: () => import("../login/userLogin.js"),
      handler: "renderUserLogin",
    },
    {
      label: "Vendor",
      description: "Manage menu, update items, and handle orders.",
      color: "bg-green-100",
      icon: "store",
      module: () => import("../login/vendorLogin.js"),
      handler: "renderVendorLogin",
    },
    {
      label: "Admin",
      description: "Manage vendors, users, and system settings.",
      color: "bg-yellow-100",
      icon: "shield",
      module: () => import("../login/adminLogin.js"),
      handler: "renderAdminLogin",
    },
  ];

  roles.forEach((role) => {
    const card = document.createElement("div");

    card.className = `
      cursor-pointer ${role.color} p-8 rounded-2xl shadow-lg
      hover:shadow-xl hover:-translate-y-1 transition-all text-center
    `;

    // ICON PLACEHOLDER
    const iconDiv = document.createElement("div");
    iconDiv.className = "flex justify-center mb-3";

    const icon = document.createElement("i");
    icon.setAttribute("data-lucide", role.icon);

    iconDiv.appendChild(icon);

    const title = document.createElement("h2");
    title.className = "text-xl font-bold mb-2";
    title.textContent = role.label;

    const desc = document.createElement("p");
    desc.className = "text-gray-700 text-sm";
    desc.textContent = role.description;

    card.append(iconDiv, title, desc);

    card.addEventListener("click", async () => {
      const mod = await role.module();
      const fn = mod?.[role.handler];
      if (typeof fn === "function") fn(root);
    });

    container.appendChild(card);
  });
  createIcons();
}
// npm install lucide