import API from "../services/api.js";

export default function renderOrders(container) {
  container.innerHTML = "<h2 class='text-xl font-bold'>Orders</h2>";

  const list = document.createElement("div");
  container.appendChild(list);

  async function load() {
    try {
      const res = await API.get("/orders/vendor");
      const orders = res.data;

      list.innerHTML = "";

      orders.forEach((order) => {
        const div = document.createElement("div");
        div.className = "bg-white p-4 shadow mb-2";

        div.innerHTML = `
          <p>User: ${order.user?.name}</p>
          <p>Total: ₹${order.total}</p>
          <p>Status: ${order.status}</p>
        `;

        list.appendChild(div);
      });
    } catch (err) {
      list.innerHTML = "Failed to load orders";
    }
  }

  load();
  setInterval(load, 5000);
}