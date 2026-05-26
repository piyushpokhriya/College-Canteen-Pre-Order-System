import API from "../services/api.js";

export default function renderManageVendors(container) {
  container.innerHTML = `
    <h2 class="text-2xl font-bold mb-4">Manage Vendors</h2>
    <div id="vendorsList"></div>
  `;

  const vendorsList = container.querySelector("#vendorsList");

  async function loadVendors() {
    try {
      const res = await API.get("/admin/vendors");
      const vendors = res.data;

      if (!vendors.length) {
        vendorsList.innerHTML = "<p>No vendors found</p>";
        return;
      }

      vendorsList.innerHTML = "";

      vendors.forEach((vendor) => {
        const card = document.createElement("div");
        card.className = "bg-white shadow p-4 rounded mb-3";

        card.innerHTML = `
          <input value="${vendor.shopName}" class="shopName border p-2 rounded w-full mb-2" />

          <p><b>Owner:</b> ${vendor.owner?.name || "N/A"}</p>
          <p><b>Email:</b> ${vendor.owner?.email || "N/A"}</p>

          <select class="status border p-2 rounded w-full my-2">
            <option value="pending" ${vendor.status === "pending" ? "selected" : ""}>pending</option>
            <option value="approved" ${vendor.status === "approved" ? "selected" : ""}>approved</option>
            <option value="rejected" ${vendor.status === "rejected" ? "selected" : ""}>rejected</option>
          </select>

          <select class="isActive border p-2 rounded w-full mb-2">
            <option value="true" ${vendor.isActive ? "selected" : ""}>Open/Active</option>
            <option value="false" ${!vendor.isActive ? "selected" : ""}>Closed/Inactive</option>
          </select>

          <div class="flex gap-2">
            <button class="update bg-blue-500 text-white px-4 py-2 rounded">
              Update
            </button>

            <button class="delete bg-red-500 text-white px-4 py-2 rounded">
              Delete
            </button>
          </div>
        `;

        card.querySelector(".update").onclick = async () => {
          await API.put(`/admin/vendors/${vendor._id}`, {
            shopName: card.querySelector(".shopName").value,
            status: card.querySelector(".status").value,
            isActive: card.querySelector(".isActive").value === "true",
          });

          alert("Vendor updated");
          loadVendors();
        };

        card.querySelector(".delete").onclick = async () => {
          if (!confirm("Delete this vendor permanently?")) return;

          await API.delete(`/admin/vendors/${vendor._id}`);

          alert("Vendor deleted");
          loadVendors();
        };

        vendorsList.appendChild(card);
      });
    } catch (err) {
      vendorsList.innerHTML =
        "<p class='text-red-500'>Failed to load vendors</p>";
    }
  }

  loadVendors();
}