import { getMenu } from "./api.js";

export async function renderMenuGrid(container, vendorId = "all") {
  container.innerHTML = "";

  try {
    //send vendorId to backend
    const res = await getMenu(vendorId);
    const items = res.data;

    if (items.length === 0) {
      container.innerHTML = "<p>No items found</p>";
      return;
    }

    items.forEach(item => {
      const card = document.createElement("div");
      card.className =
        "bg-white p-4 rounded-xl shadow hover:shadow-xl transition";

      // IMAGE
      const img = document.createElement("img");
      img.src = item.image
        ? `http://localhost:5000/uploads/${item.image}`
        : "https://via.placeholder.com/300";

      img.className = "w-full h-40 object-cover rounded mb-3";

      // NAME
      const name = document.createElement("h3");
      name.className = "text-lg font-bold";
      name.textContent = item.name;

      // PRICE
      const price = document.createElement("p");
      price.className = "text-green-600 font-semibold";
      price.textContent = `₹${item.finalPrice || item.price}`;

      // BUTTON
      const btn = document.createElement("button");
      btn.className =
        "mt-3 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600";
      btn.textContent = "Add to Cart";

      btn.onclick = () => alert(`Added ${item.name}`);

      card.append(img, name, price, btn);
      container.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    container.innerHTML =
      "<p class='text-red-500'>Failed to load menu</p>";
  }
}