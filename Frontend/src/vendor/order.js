import API from "../services/api.js";

export function renderOrders(container) {
  container.innerHTML = "";

  // ================= TITLE =================
  const title = document.createElement("h2");
  title.className = "text-xl font-bold mb-4";
  title.textContent = "Orders";

  container.appendChild(title);

  // ================= LIST =================
  const listDiv = document.createElement("div");
  listDiv.className = "space-y-4";
  container.appendChild(listDiv);

  // ================= FETCH ORDERS =================
  async function fetchOrders() {
    listDiv.innerHTML = "<p class='text-gray-500'>Loading orders...</p>";

    try {
      const res = await API.get("/order");
      const orders = res?.data || [];

      listDiv.innerHTML = "";

      if (!orders.length) {
        listDiv.innerHTML =
          "<p class='text-gray-500'>No orders found</p>";
        return;
      }

      orders.forEach((order) => {
        const card = document.createElement("div");
        card.className = "p-4 bg-white rounded shadow";

        const student = document.createElement("h3");
        student.className = "font-bold";
        student.textContent = `Student ID: ${order.studentId}`;

        const items = document.createElement("ul");
        items.className = "mt-2 list-disc ml-5";

        order.items.forEach((i) => {
          const li = document.createElement("li");
          li.textContent = `${i.name} x ${i.quantity} - ₹${i.price}`;
          items.appendChild(li);
        });

        const total = document.createElement("p");
        total.className = "font-semibold mt-2";
        total.textContent = `Total: ₹${order.totalAmount}`;

        const status = document.createElement("p");
        status.className = "text-sm text-gray-500";
        status.textContent = `Status: ${order.status}`;

        card.append(student, items, total, status);
        listDiv.appendChild(card);
      });
    } catch (err) {
      console.error("Order fetch error:", err);
      listDiv.innerHTML =
        "<p class='text-red-500'>Failed to load orders</p>";
    }
  }

  fetchOrders();
}