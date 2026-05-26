import API from "../services/api.js";

export default function renderOrders(container) {
  container.innerHTML = "";

  const title = document.createElement("h2");
  title.textContent = "My Orders";
  title.className = "text-xl font-bold mb-4";

  container.appendChild(title);

  const list = document.createElement("div");

  container.appendChild(list);

  async function load() {
    list.innerHTML = "Loading...";

    try {
      const res = await API.get("/orders/user");

      const orders = res.data;

      list.innerHTML = "";

      if (!orders.length) {
        list.innerHTML = "No orders yet";
        return;
      }

      orders.forEach((order) => {
        const div = document.createElement("div");

        div.className =
          "p-4 bg-white shadow mb-2 rounded";

        div.innerHTML = `
          <p>
            <b>Order ID:</b>

            <span class="font-bold text-blue-600">
              ${order.orderCode || "Generating..."}
            </span>
          </p>

          <p>
            <b>Items:</b>

            ${order.items
              .map((i) => `${i.name} x ${i.quantity}`)
              .join(", ")}
          </p>

          <p>
            <b>Total:</b>
            ₹${order.total}
          </p>

          <p>
            <b>Status:</b>
            ${order.status}
          </p>

          <p>
            <b>Payment:</b>
            ${order.paymentStatus || "Pending"}
          </p>

          <p>
            <b>Pickup:</b>
            ${order.pickupTime || "Not selected"}
          </p>
        `;

        list.appendChild(div);
      });

    } catch (err) {
      console.log(err);

      list.innerHTML = `
        <p class="text-red-500">
          Failed to load orders
        </p>
      `;
    }
  }

  load();
}