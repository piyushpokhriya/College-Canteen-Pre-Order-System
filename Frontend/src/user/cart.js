import API from "../services/api.js";

export default function renderCart(container) {
  container.innerHTML = "";

  const title = document.createElement("h2");
  title.className = "text-2xl font-bold mb-4 px-6";
  title.textContent = "Your Cart";
  container.appendChild(title);

  const cartBox = document.createElement("div");
  cartBox.className = "p-6";
  container.appendChild(cartBox);

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
          "flex flex-col md:flex-row md:items-center md:justify-between bg-white shadow p-4 rounded mb-3 gap-4";

        card.innerHTML = `
          <div class="flex items-center gap-4">
            <img src="http://localhost:5000/uploads/${item.image}"
              class="w-16 h-16 object-cover rounded"/>

            <div>
              <h3 class="font-bold">${item.name}</h3>
              <p>₹${item.price} each</p>
            </div>
          </div>

          <div class="font-bold">
            ₹${item.price * item.quantity}
          </div>
        `;

        const controls = document.createElement("div");
        controls.className = "flex items-center gap-2";

        const minusBtn = document.createElement("button");
        minusBtn.textContent = "-";
        minusBtn.className =
          "bg-gray-200 px-3 py-1 rounded font-bold";

        const qtyText = document.createElement("span");
        qtyText.textContent = item.quantity;
        qtyText.className = "font-bold px-2";

        const plusBtn = document.createElement("button");
        plusBtn.textContent = "+";
        plusBtn.className =
          "bg-gray-200 px-3 py-1 rounded font-bold";

        minusBtn.onclick = async () => {
          if (item.quantity <= 1) return;

          try {
            await API.put(`/cart/update/${item.menuId}`, {
              quantity: item.quantity - 1,
            });

            loadCart();
          } catch (err) {
            alert("Failed to update quantity");
          }
        };

        plusBtn.onclick = async () => {
          try {
            await API.put(`/cart/update/${item.menuId}`, {
              quantity: item.quantity + 1,
            });

            loadCart();
          } catch (err) {
            alert("Failed to update quantity");
          }
        };

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.className =
          "bg-red-500 text-white px-3 py-1 rounded";

        removeBtn.onclick = async () => {
          try {
            await API.delete(`/cart/${item.menuId}`);
            loadCart();
          } catch (err) {
            alert("Remove failed");
          }
        };

        controls.append(minusBtn, qtyText, plusBtn, removeBtn);
        card.appendChild(controls);
        cartBox.appendChild(card);
      });

      const totalDiv = document.createElement("div");
      totalDiv.className =
        "mt-6 text-xl font-bold flex justify-between bg-gray-100 p-4 rounded";

      totalDiv.innerHTML = `
        <span>Total Amount</span>
        <span>₹${total}</span>
      `;

      cartBox.appendChild(totalDiv);

      const pickupDiv = document.createElement("div");
      pickupDiv.className = "mt-4 bg-white shadow p-4 rounded";

      pickupDiv.innerHTML = `
        <label class="font-semibold block mb-2">
          Select Pickup Time
        </label>

        <input
          id="pickupTime"
          type="time"
          class="border p-2 rounded w-full"
        />
      `;

      cartBox.appendChild(pickupDiv);

      const orderBtn = document.createElement("button");
      orderBtn.textContent = "Place Order";
      orderBtn.className =
        "w-full mt-4 bg-green-500 text-white py-3 rounded hover:bg-green-600";

      orderBtn.onclick = async () => {
        try {
          const pickupTime =
            document.querySelector("#pickupTime").value;

          if (!pickupTime) {
            alert("Please select pickup time");
            return;
          }

          const res = await API.post("/orders/place", {
            pickupTime,
          });

          const orders = res.data.orders || [];

          for (const order of orders) {
            await API.post("/orders/payment-success", {
              orderId: order._id,
              paymentId: "dummy_payment_" + Date.now(),
            });
          }

          alert("Order placed successfully!");

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