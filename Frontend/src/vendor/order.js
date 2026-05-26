import API from "../services/api.js";

export default function renderOrders(container) {
  container.innerHTML = `
    <h2 class='text-2xl font-bold mb-4'>
      Vendor Orders
    </h2>
  `;

  const list = document.createElement("div");
  container.appendChild(list);

  async function load() {
    try {
      const res = await API.get("/orders/vendor");
      const orders = res.data;

      list.innerHTML = "";

      if (!orders.length) {
        list.innerHTML = `
          <p class="text-gray-500">
            No orders yet
          </p>
        `;
        return;
      }

      orders.forEach((order) => {
        const div = document.createElement("div");
        div.className =
          "bg-white p-4 shadow rounded mb-4";

        const items = order.items
          ?.map((item) => `${item.name} x ${item.quantity}`)
          .join(", ");

        div.innerHTML = `
          <p>
            <b>Order ID:</b>
            <span class="font-bold text-blue-600">
              ${order.orderCode || "Generating..."}
            </span>
          </p>

          <p><b>User:</b> ${order.user?.name || "N/A"}</p>

          <p><b>Items:</b> ${items || "No items"}</p>

          <p><b>Total:</b> ₹${order.total}</p>

          <p><b>Status:</b> ${order.status}</p>

          <p><b>Payment:</b> ${order.paymentStatus}</p>

          <p>
            <b>Pickup:</b>
            ${order.pickupTime || "Not selected"}
            ${order.pickupDay === "Next Day" ? "(Next Day)" : "(Today)"}
          </p>
        `;

        if (order.status !== "Completed") {
          const completeBtn = document.createElement("button");

          completeBtn.textContent = "Mark as Picked Up";

          completeBtn.className =
            "bg-green-500 text-white px-4 py-2 rounded mt-3";

          completeBtn.onclick = async () => {
            try {
              await API.put(`/orders/vendor/complete/${order._id}`);
              load();
            } catch (err) {
              alert("Failed to update order");
            }
          };

          div.appendChild(completeBtn);
        }

        list.appendChild(div);
      });
    } catch (err) {
      console.error(err);

      list.innerHTML = `
        <p class="text-red-500">
          Failed to load orders
        </p>
      `;
    }
  }

  load();
  setInterval(load, 5000);
}