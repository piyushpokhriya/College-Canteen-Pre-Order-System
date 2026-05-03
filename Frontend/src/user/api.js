import API from "../services/api.js";

export const getVendors = () => API.get("/vendor");
export const getMenu = (vendorId) => {

  if (!vendorId || vendorId === "all") {
    return API.get("/menu");
  }

  // specific vendor
  return API.get(`/menu?vendorId=${vendorId}`);
};