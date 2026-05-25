import API from "../services/api.js";

export default async function renderAdminOrders(container) {
  container.innerHTML =
    "<h2 class='text-xl font-bold mb-4'>All Orders</h2>";

  try {
    const res = await API.get("/orders/admin");
    const orders = res.data;

    if (!orders.length) {
      container.innerHTML += "<p>No orders found</p>";
      return;
    }

    orders.forEach((order) => {
      const card = document.createElement("div");
      card.className = "bg-white shadow p-4 rounded mb-4";

      const items = order.items
        .map((i) => `${i.name} x ${i.quantity}`)
        .join(", ");

      card.innerHTML = `
        <p><b>User:</b> ${order.user?.name || "N/A"}</p>
        <p><b>Vendor:</b> ${order.vendorId?.shopName || "N/A"}</p>
        <p><b>Items:</b> ${items}</p>
        <p><b>Total:</b> ₹${order.total}</p>
        <p><b>Status:</b> ${order.status}</p>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    container.innerHTML +=
      "<p class='text-red-500'>Failed to load orders</p>";
  }
}