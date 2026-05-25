import API from "../services/api.js";

export const getVendors = () => API.get("/vendor");

export const getMenu = (vendorId = "all") => {
  if (!vendorId || vendorId === "all") {
    return API.get("/menu");
  }

  return API.get(`/menu?vendorId=${vendorId}`);
};