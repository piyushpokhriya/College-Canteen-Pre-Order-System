import API from "../services/api.js";
import { renderRoleCards } from "./roleCards.js";

export default async function renderHome(root) {
  root.innerHTML = "";

  // ===== HERO SECTION =====
  const hero = document.createElement("section");
  hero.className =
    "bg-gradient-to-r from-purple-400 to-pink-400 text-white py-16 text-center";

  const title = document.createElement("h1");
  title.className = "text-4xl md:text-5xl font-bold mb-4";
  title.textContent = "College Canteen Pre-Order System";

  const subtitle = document.createElement("p");
  subtitle.className = "text-lg md:text-xl mb-2";
  subtitle.textContent =
    "Order food, manage menus, and track orders efficiently.";

  const info = document.createElement("p");
  info.className = "text-md md:text-lg opacity-90";
  info.textContent = "Select your role to continue";

  hero.append(title, subtitle, info);
  root.appendChild(hero);

  // ===== ROLE SECTION =====
  const roleSection = document.createElement("section");
  roleSection.className = "py-12 bg-gray-50";

  const container = document.createElement("div");
  container.className =
    "max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8";

  roleSection.appendChild(container);
  root.appendChild(roleSection);

  // ===== ROLE CARDS =====
  renderRoleCards(container, root);

  // ===== TOP ITEMS SECTION =====
  const topSection = document.createElement("section");
  topSection.className = "py-12 px-6";

  const topTitle = document.createElement("h2");
  topTitle.className = "text-2xl font-bold mb-6 text-center";
  topTitle.textContent = "🔥 Top Items";

  const grid = document.createElement("div");
  grid.className =
    "grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto";

  topSection.append(topTitle, grid);
  root.appendChild(topSection);

  // ===== CHECK TOKEN =====
  const token = localStorage.getItem("token");

  if (!token) {
    grid.innerHTML =
      "<p class='text-gray-500 text-center'>Login to see top items</p>";
    return;
  }

  // ===== FETCH TOP ITEMS =====
  try {
    const res = await API.get("/menu/top");
    const items = res.data;

    if (items.length === 0) {
      grid.innerHTML =
        "<p class='text-gray-500 text-center'>No items available</p>";
      return;
    }

    items.forEach(item => {
      const card = document.createElement("div");
      card.className =
        "bg-white p-4 rounded-xl shadow hover:shadow-lg transition";

      // IMAGE
      const img = document.createElement("img");
      img.src = item.image
        ? `http://localhost:5000/uploads/${item.image}`
        : "https://via.placeholder.com/300";

      img.className = "w-full h-40 object-cover rounded mb-3";

      // NAME
      const name = document.createElement("h3");
      name.className = "font-bold text-lg";
      name.textContent = item.name;

      // PRICE
      const price = document.createElement("p");
      price.className = "text-green-600 font-semibold";
      price.textContent = `₹${item.price}`;

      card.append(img, name, price);
      grid.appendChild(card);
    });

  } catch (err) {
    console.error("Top Items Error:", err);
    grid.innerHTML =
      "<p class='text-red-500 text-center'>Failed to load top items</p>";
  }
}