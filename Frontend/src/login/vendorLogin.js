import { renderVendorSignup } from "./vendorSignup.js";
import API from "../services/api.js";

export function renderVendorLogin(root) {
  root.innerHTML = "";

  // ================= CONTAINER =================
  const container = document.createElement("div");
  container.className =
    "max-w-md mx-auto mt-16 p-8 bg-white rounded shadow";

  const title = document.createElement("h2");
  title.className = "text-2xl font-bold mb-6 text-center";
  title.textContent = "Vendor Login";

  const errorBox = document.createElement("p");
  errorBox.className = "text-red-500 text-sm mb-3 hidden";

  // ================= INPUT CREATOR (REDUCES REDUNDANCY) =================
  const createInput = (type, placeholder) => {
    const input = document.createElement("input");
    input.type = type;
    input.placeholder = placeholder;
    input.className = "w-full p-3 mb-4 border rounded";
    return input;
  };

  const collegeInput = createInput("text", "College Name");
  const emailInput = createInput("email", "Email");
  const passwordInput = createInput("password", "Password");

  // ================= LOGIN BUTTON =================
  const loginBtn = document.createElement("button");
  loginBtn.className =
    "w-full bg-purple-500 text-white py-3 rounded hover:bg-purple-600";
  loginBtn.textContent = "Login";

  loginBtn.onclick = async () => {
    errorBox.classList.add("hidden");

    const collegeName = collegeInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!collegeName || !email || !password) {
      errorBox.textContent = "All fields are required";
      errorBox.classList.remove("hidden");
      return;
    }

    try {
      loginBtn.disabled = true;
      loginBtn.textContent = "Logging in...";

      const res = await API.post("/auth/login", {
        collegeName,
        email,
        password,
      });

      const data = res?.data;

      if (!data?.token) {
        throw new Error("Invalid response from server");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data?.user?.role || "vendor");

      location.reload();
    } catch (err) {
      console.error("Vendor login error:", err);
      errorBox.textContent = "Login failed. Check credentials.";
      errorBox.classList.remove("hidden");
    } finally {
      loginBtn.disabled = false;
      loginBtn.textContent = "Login";
    }
  };

  // ================= SIGNUP LINK =================
  const toggle = document.createElement("p");
  toggle.className =
    "mt-4 text-sm text-center text-blue-500 cursor-pointer";
  toggle.textContent = "Don't have an account? Signup";

  toggle.onclick = () => renderVendorSignup(root);

  // ================= APPEND =================
  container.append(
    title,
    errorBox,
    collegeInput,
    emailInput,
    passwordInput,
    loginBtn,
    toggle
  );

  root.appendChild(container);
}