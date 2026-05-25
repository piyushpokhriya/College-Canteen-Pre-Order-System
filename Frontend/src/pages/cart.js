import API from "../services/api.js";

export default function renderCart(container) {
  container.innerHTML = "<h2 class='text-xl font-bold mb-4'>Your Cart</h2>";

  const list = document.createElement("div");
  const totalDiv = document.createElement("div");

  container.appendChild(list);
  container.appendChild(totalDiv);

  let cartData = [];

  // ================= LOAD CART =================
  async function loadCart() {
    try {
      const res = await API.get("/cart");
      cartData = res.data.items || [];

      list.innerHTML = "";

      if (!cartData.length) {
        list.innerHTML = "<p>No items in cart</p>";
        totalDiv.innerHTML = "";
        return;
      }

      let total = 0;

      cartData.forEach((item) => {
        const div = document.createElement("div");
        div.className = "bg-white p-3 shadow mb-2";

        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        div.innerHTML = `
          <h3 class="font-bold">${item.name}</h3>
          <p>Price: ₹${item.price}</p>
          <p>Qty: ${item.quantity}</p>
          <p>Total: ₹${itemTotal}</p>
        `;

        list.appendChild(div);
      });

      totalDiv.innerHTML = `
        <div class="mt-4 p-4 bg-gray-100">
          <h2 class="text-lg font-bold">Grand Total: ₹${total}</h2>

          <button id="payBtn" class="bg-green-600 text-white px-4 py-2 mt-3 rounded">
            Pay Now
          </button>
        </div>
      `;

      document.getElementById("payBtn").onclick = () => {
        createPayment(total);
      };

    } catch (err) {
      console.log(err);
      list.innerHTML = "Failed to load cart";
    }
  }

  // ================= PAYMENT =================
  async function createPayment(amount) {
    try {
      const res = await API.post("/payment/create-order", {
        amount,
      });

      const order = res.data;

      const options = {
        key: order.key || "rzp_test_xxxxx",
        amount: order.amount,
        currency: "INR",
        order_id: order.id,
        handler: async function (response) {
          try {
            await API.post("/payment/verify", {
              order_id: order.id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });

            alert("Payment Success 🎉");
            await API.post("/cart/clear");
            loadCart();

          } catch (err) {
            alert("Payment verification failed");
          }
        },
      };

      const rzp = new Razorpay(options);
      rzp.open();

    } catch (err) {
      console.log(err);
      alert("Payment failed");
    }
  }

  loadCart();
}