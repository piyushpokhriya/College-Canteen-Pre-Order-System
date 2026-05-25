import API from "../services/api.js";

export async function renderMenuGrid(container, vendorId = "all") {
  container.innerHTML = "";

  try {
    const url =
      vendorId && vendorId !== "all"
        ? `/menu?vendorId=${vendorId}`
        : "/menu";

    const res = await API.get(url);
    const items = res.data;

    if (!items || items.length === 0) {
      container.innerHTML =
        "<p class='text-gray-500'>No items found</p>";
      return;
    }

    items.forEach((item) => {
      const card = document.createElement("div");

      card.className =
        "bg-white p-4 rounded-xl shadow hover:shadow-lg transition";

      // ================= IMAGE =================
      const img = document.createElement("img");
      img.src = item.image
        ? `http://localhost:5000/uploads/${item.image}`
        : "https://via.placeholder.com/300";

      img.className =
        "w-full h-40 object-cover rounded mb-3";

      // ================= NAME =================
      const name = document.createElement("h3");
      name.className = "text-lg font-bold";
      name.textContent = item.name;

      // ================= PRICE =================
      const price = document.createElement("p");

      if (item.discount > 0) {
        price.innerHTML = `
          <span class="line-through text-gray-500">
            ₹${item.price}
          </span>
          <span class="text-green-600 font-bold ml-2">
            ₹${item.finalPrice}
          </span>
          <span class="bg-red-500 text-white text-xs px-2 py-1 rounded ml-2">
            ${item.discount}% OFF
          </span>
        `;
      } else {
        price.className = "text-green-600 font-semibold";
        price.textContent = `₹${item.price}`;
      }

      // ================= ADD TO CART BUTTON =================
      const btn = document.createElement("button");

    btn.className =
      "mt-3 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600";

    btn.textContent = "Add To Cart";

    btn.onclick = async () => {
      try {
        await API.post("/cart/add", {
          menuId: item._id
        });

        alert("Added to cart successfully");
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.msg || "Failed to add item");
      }
    };

      // ================= CARD APPEND =================
      card.append(img, name, price, btn);
      container.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    container.innerHTML =
      "<p class='text-red-500'>Failed to load menu</p>";
  }
}