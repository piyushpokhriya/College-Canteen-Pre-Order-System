import API from "../services/api.js";

export function renderMenu(container) {
  container.innerHTML = "";

  // ================= ADD FORM =================
  const form = document.createElement("div");
  form.className = "p-6 bg-white rounded shadow mb-6";

  const title = document.createElement("h2");
  title.className = "text-xl font-bold mb-4";
  title.textContent = "Add Menu Item";

  const nameInput = document.createElement("input");
  nameInput.placeholder = "Item Name";
  nameInput.className = "w-full p-3 mb-3 border rounded";

  const priceInput = document.createElement("input");
  priceInput.type = "number";
  priceInput.placeholder = "Price (₹)";
  priceInput.className = "w-full p-3 mb-3 border rounded";

  // FILE INPUT (IMAGE)
  const imageInput = document.createElement("input");
  imageInput.type = "file";
  imageInput.accept = "image/*";
  imageInput.className = "w-full p-3 mb-3 border rounded";

  const btn = document.createElement("button");
  btn.innerText = "Add Item";
  btn.className =
    "w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600";

  form.append(title, nameInput, priceInput, imageInput, btn);
  container.appendChild(form);

  // ================= MENU LIST =================
  const listDiv = document.createElement("div");
  listDiv.className = "grid grid-cols-1 md:grid-cols-3 gap-6";
  container.appendChild(listDiv);

  // ================= FETCH MENU =================
  async function fetchMenu() {
    listDiv.innerHTML = "";

    try {
      const res = await API.get("/menu/vendor");
      const items = res.data;

      items.forEach((item) => {
        const card = document.createElement("div");
        card.className =
          "bg-white p-4 rounded-xl shadow hover:shadow-lg";

        // IMAGE SHOW
        const img = document.createElement("img");
        img.src = item.image
          ? `http://localhost:5000/uploads/${item.image}`
          : "https://via.placeholder.com/300";

        img.className = "w-full h-40 object-cover rounded mb-3";

        const name = document.createElement("h3");
        name.className = "font-bold";
        name.textContent = item.name;

        const price = document.createElement("p");
        price.textContent = `₹${item.price}`;

        const delBtn = document.createElement("button");
        delBtn.innerText = "Delete";
        delBtn.className =
          "mt-2 w-full bg-red-500 text-white py-1 rounded hover:bg-red-600";

        delBtn.onclick = async () => {
          try {
            await API.delete(`/menu/${item._id}`);
            fetchMenu();
          } catch (err) {
            console.error(err);
            alert("Delete failed");
          }
        };

        card.append(img, name, price, delBtn);
        listDiv.appendChild(card);
      });
    } catch (err) {
      console.error(err);
      listDiv.innerHTML =
        "<p class='text-red-500'>Failed to load menu</p>";
    }
  }

  // ================= ADD ITEM =================
  btn.onclick = async () => {
    try {
      if (!nameInput.value || !priceInput.value || !imageInput.files[0]) {
        return alert("Fill all fields");
      }

      const formData = new FormData();
      formData.append("name", nameInput.value);
      formData.append("price", priceInput.value);
      formData.append("image", imageInput.files[0]);

      await API.post("/menu", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Item added successfully!");

      // reset form
      nameInput.value = "";
      priceInput.value = "";
      imageInput.value = "";

      // refresh list
      fetchMenu();

    } catch (err) {
      console.error(err);
      alert(
        "Error adding item: " +
        (err.response?.data?.msg || "Server error")
      );
    }
  };

  // initial load
  fetchMenu();
}