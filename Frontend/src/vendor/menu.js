import API from "../services/api.js";

export function renderMenu(container) {
  container.innerHTML = "";

  // ================= ADD MENU FORM =================
  const form = document.createElement("div");
  form.className = "p-6 bg-white rounded shadow mb-6";

  form.innerHTML = `
    <h2 class="text-xl font-bold mb-4">Add Menu Item</h2>

    <input id="name" placeholder="Item Name" class="w-full p-2 border mb-2"/>

    <input id="price" type="number" placeholder="Price" class="w-full p-2 border mb-2"/>

    <input id="image" type="file" class="w-full p-2 border mb-2"/>

    <button id="addBtn" class="bg-purple-600 text-white px-4 py-2 rounded w-full">
      Add Item
    </button>
  `;

  container.appendChild(form);

  // ================= MENU LIST =================
  const list = document.createElement("div");
  list.className = "grid grid-cols-1 md:grid-cols-3 gap-4";
  container.appendChild(list);

  // ================= LOAD MENU =================
  async function loadMenu() {
    list.innerHTML = "";

    try {
      const res = await API.get("/menu/vendor");
      const items = res.data;

      if (!items.length) {
        list.innerHTML =
          "<p class='text-gray-500'>No menu items found</p>";
        return;
      }

      items.forEach((item) => {
        const card = document.createElement("div");
        card.className = "bg-white p-4 shadow rounded";

        const finalPrice =
          item.discount > 0
            ? item.price - (item.price * item.discount) / 100
            : item.price;

        // ================= IMAGE =================
        const img = document.createElement("img");
        img.src = item.image
          ? item.image.startsWith("http")
            ? item.image
            : `http://localhost:5000/uploads/${item.image}`
          : "https://via.placeholder.com/300";

        img.className = "w-full h-40 object-cover rounded mb-3";

        // ================= INFO =================
        const name = document.createElement("h3");
        name.className = "font-bold";
        name.textContent = item.name;

        const price = document.createElement("p");
        price.innerHTML = `
          <b>Price:</b> ₹${item.price} <br/>
          <b>Final:</b> ₹${finalPrice}
        `;

        const discount = document.createElement("p");
        discount.className = "text-red-500";
        discount.textContent = `${item.discount || 0}% OFF`;

        // ================= DISCOUNT INPUT =================
        const input = document.createElement("input");
        input.type = "number";
        input.placeholder = "Enter Discount %";
        input.className = "border p-2 w-full mt-2";

        // ================= APPLY DISCOUNT =================
        const applyBtn = document.createElement("button");
        applyBtn.textContent = "Apply / Update Discount";
        applyBtn.className =
          "bg-green-500 text-white px-3 py-2 mt-2 rounded w-full";

        applyBtn.onclick = async () => {
          try {
            await API.put(`/vendor/menu/discount/${item._id}`, {
              discount: Number(input.value),
            });

            loadMenu();
          } catch (err) {
            console.log(err);
            alert("Failed to apply discount");
          }
        };

        // ================= REMOVE DISCOUNT =================
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove Discount";
        removeBtn.className =
          "bg-red-500 text-white px-3 py-2 mt-2 rounded w-full";

        removeBtn.onclick = async () => {
          try {
            await API.put(`/vendor/menu/discount/${item._id}`, {
              discount: 0,
            });

            loadMenu();
          } catch (err) {
            console.log(err);
            alert("Failed to remove discount");
          }
        };

        // ================= DELETE ITEM =================
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete Item";
        deleteBtn.className =
          "bg-black text-white px-3 py-2 mt-2 rounded w-full";

        deleteBtn.onclick = async () => {
          const ok = confirm(
            `Delete "${item.name}" permanently?`
          );

          if (!ok) return;

          try {
            await API.delete(`/menu/${item._id}`);

            alert("Item deleted successfully");

            loadMenu();
          } catch (err) {
            console.log(err);
            alert("Failed to delete item");
          }
        };

        // ================= APPEND =================
        card.append(
          img,
          name,
          price,
          discount,
          input,
          applyBtn,
          removeBtn,
          deleteBtn
        );

        list.appendChild(card);
      });
    } catch (err) {
      console.log(err);
      list.innerHTML =
        "<p class='text-red-500'>Failed to load menu</p>";
    }
  }

  // ================= ADD ITEM =================
  form.querySelector("#addBtn").onclick = async () => {
    try {
      const name = document.querySelector("#name").value;
      const price = document.querySelector("#price").value;
      const image = document.querySelector("#image").files[0];

      const fd = new FormData();
      fd.append("name", name);
      fd.append("price", price);
      fd.append("image", image);

      await API.post("/menu", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      document.querySelector("#name").value = "";
      document.querySelector("#price").value = "";
      document.querySelector("#image").value = "";

      loadMenu();
    } catch (err) {
      console.log(err);
      alert("Add item failed");
    }
  };

  loadMenu();
}