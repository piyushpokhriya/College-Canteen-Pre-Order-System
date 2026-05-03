// src/main.js
import renderHome from "./home/index.js";
import renderUser from "./user/index.js";
import renderVendor from "./vendor/index.js";
import renderAdmin from "./admin/index.js";

const root = document.getElementById("root");

// CHECK AUTH
const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

if (!token || !role) {
  // Not logged in
  renderHome(root);
} else {
  // Logged in → role based routing
  if (role === "student") {
    renderUser(root);
  } 
  else if (role === "vendor") {
    renderVendor(root);
  } 
  else if (role === "admin") {
    renderAdmin(root);
  } 
  else {
    renderHome(root);
  }
}