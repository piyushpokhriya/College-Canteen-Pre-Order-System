import API from "../services/api.js";

export async function renderVendorFilter(container, onChange) {
  container.innerHTML = "";

  const select = document.createElement("select");
  select.className = "p-3 border rounded w-full";
  container.appendChild(select);

  try {
    const res = await API.get("/vendor");
    const vendors = res.data;

    // default
    const defaultOpt = document.createElement("option");
    defaultOpt.value = "all";
    defaultOpt.textContent = "All Vendors";
    select.appendChild(defaultOpt);

    vendors.forEach(v => {
      const opt = document.createElement("option");
      opt.value = v._id;
      opt.textContent = v.shopName;
      select.appendChild(opt);
    });

    select.onchange = () => {
      const selectedId = select.value;

      const selectedVendor = vendors.find(v => v._id === selectedId);

      // Pass vendor object
      onChange(selectedId, selectedVendor);
    };

  } catch (err) {
  console.error(err);

  select.innerHTML = `
    <option value="all">All Vendors</option>
  `;
}
}


