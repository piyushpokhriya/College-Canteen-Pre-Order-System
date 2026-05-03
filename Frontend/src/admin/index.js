import API from "../services/api.js";

export default async function renderAdmin(root) {
  root.innerHTML = "";

  // ================= HEADER =================
  const header = document.createElement("header");
  header.className = "flex justify-between items-center bg-yellow-500 text-white p-6";

  const title = document.createElement("h1");
  title.className = "text-2xl font-bold";
  title.textContent = "Admin Panel";

  const logoutBtn = document.createElement("button");
  logoutBtn.className = "bg-white text-yellow-500 px-4 py-2 rounded";

  logoutBtn.textContent = "Logout";
  logoutBtn.onclick = () => {
    localStorage.clear();
    location.reload();
  };

  header.append(title, logoutBtn);
  root.appendChild(header);

  // ================= MENU LIST =================
  const container = document.createElement("div");
  container.className = "grid grid-cols-1 md:grid-cols-3 gap-6 p-6";
  root.appendChild(container);

  // ================= FETCH MENU =================
  async function fetchMenu() {
    container.innerHTML = "";

    try {
      const res = await API.get("/menu");
      const items = res.data;

      items.forEach(item => {
        const card = document.createElement("div");
        card.className = "bg-white p-4 rounded-xl shadow";

        // IMAGE
        const img = document.createElement("img");
        img.src = item.image || "https://via.placeholder.com/300";
        img.className = "w-full h-40 object-cover rounded mb-3";

        // NAME
        const name = document.createElement("h3");
        name.className = "font-bold";
        name.textContent = item.name;

        // PRICE
        const price = document.createElement("p");

        if (item.discount > 0) {
          price.innerHTML = `
            <span class="line-through text-gray-500">₹${item.price}</span>
            <span class="text-green-600 font-bold ml-2">₹${item.finalPrice}</span>
            <span class="text-xs bg-red-500 text-white px-2 py-1 ml-2 rounded">${item.discount}% OFF</span>
          `;
        } else {
          price.textContent = `₹${item.price}`;
        }

        // DISCOUNT INPUT
        const discountInput = document.createElement("input");
        discountInput.type = "number";
        discountInput.placeholder = "Discount %";
        discountInput.className = "w-full p-2 border rounded mt-3";

        // APPLY BUTTON
        const applyBtn = document.createElement("button");
        applyBtn.textContent = "Apply Discount";
        applyBtn.className =
          "mt-2 w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600";

        applyBtn.onclick = async () => {
          if (!discountInput.value) {
            return alert("Enter discount");
          }

          try {
            await API.put(`/admin/discount/${item._id}`, {
              discount: Number(discountInput.value)
            });

            fetchMenu(); // refresh UI
          } catch (err) {
            console.error(err);
            alert("Failed to apply discount");
          }
        };

        card.append(img, name, price, discountInput, applyBtn);
        container.appendChild(card);
      });

    } catch (err) {
      console.error(err);
      container.innerHTML =
        "<p class='text-red-500'>Failed to load menu</p>";
    }
  }

  fetchMenu();
}