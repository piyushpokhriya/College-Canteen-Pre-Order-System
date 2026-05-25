import API from "../services/api.js";

export default function renderCart(container) {
  container.innerHTML = "";

  // ================= TITLE =================
  const title = document.createElement("h2");
  title.className = "text-2xl font-bold mb-4 px-6";
  title.textContent = "Your Cart";

  container.appendChild(title);

  // ================= CART WRAPPER =================
  const cartBox = document.createElement("div");
  cartBox.className = "p-6";

  container.appendChild(cartBox);

  // ================= FETCH CART =================
  async function loadCart() {
    cartBox.innerHTML = "";

    try {
      const res = await API.get("/cart");
      const cart = res.data;

      if (!cart || cart.items.length === 0) {
        cartBox.innerHTML =
          "<p class='text-gray-500'>Cart is empty</p>";
        return;
      }

      let total = 0;

      cart.items.forEach((item) => {
        total += item.price * item.quantity;

        const card = document.createElement("div");
        card.className =
          "flex items-center justify-between bg-white shadow p-4 rounded mb-3";

        card.innerHTML = `
          <div class="flex items-center gap-4">
            <img src="http://localhost:5000/uploads/${item.image}"
              class="w-16 h-16 object-cover rounded"/>

            <div>
              <h3 class="font-bold">${item.name}</h3>
              <p>₹${item.price} x ${item.quantity}</p>
            </div>
          </div>

          <div class="font-bold">
            ₹${item.price * item.quantity}
          </div>
        `;

        // REMOVE BUTTON
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.className =
          "ml-4 bg-red-500 text-white px-3 py-1 rounded";

        removeBtn.onclick = async () => {
          try {
            await API.delete(`/cart/${item.menuId}`);
            loadCart();
          } catch (err) {
            alert("Remove failed");
          }
        };

        card.appendChild(removeBtn);
        cartBox.appendChild(card);
      });

      // ================= TOTAL SECTION =================
      const totalDiv = document.createElement("div");
      totalDiv.className =
        "mt-6 text-xl font-bold flex justify-between bg-gray-100 p-4 rounded";

      totalDiv.innerHTML = `
        <span>Total Amount</span>
        <span>₹${total}</span>
      `;

      cartBox.appendChild(totalDiv);

      // ================= PLACE ORDER BUTTON =================
      const orderBtn = document.createElement("button");
      orderBtn.textContent = "Place Order";
      orderBtn.className =
        "w-full mt-4 bg-green-500 text-white py-3 rounded hover:bg-green-600";

      orderBtn.onclick = async () => {
        try {
          const res = await API.post("/orders/place");

          alert("Order placed successfully!");

          console.log("Order:", res.data);

          loadCart();
        } catch (err) {
          alert(
            err.response?.data?.msg ||
              "Order failed"
          );
        }
      };

      cartBox.appendChild(orderBtn);

    } catch (err) {
      console.error(err);
      cartBox.innerHTML =
        "<p class='text-red-500'>Failed to load cart</p>";
    }
  }

  loadCart();
}