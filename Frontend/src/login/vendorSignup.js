import { renderVendorLogin } from "./vendorLogin.js";
import API from "../services/api.js";

export function renderVendorSignup(root) {
  root.innerHTML = "";

  // ================= CONTAINER =================
  const container = document.createElement("div");
  container.className =
    "max-w-md mx-auto mt-16 p-8 bg-white rounded shadow";

  const title = document.createElement("h2");
  title.className = "text-2xl font-bold mb-6 text-center";
  title.textContent = "Vendor Signup";

  const errorBox = document.createElement("p");
  errorBox.className = "text-red-500 text-sm mb-3 hidden";

  // ================= INPUT CREATOR =================
  const createInput = (type, placeholder) => {
    const input = document.createElement("input");
    input.type = type;
    input.placeholder = placeholder;
    input.className = "w-full p-3 mb-4 border rounded";
    return input;
  };

  const shopInput = createInput("text", "Shop Name");
  const nameInput = createInput("text", "Owner Name");
  const collegeInput = createInput("text", "College Name");
  const emailInput = createInput("email", "Email");
  const passwordInput = createInput("password", "Password");

  // ================= SIGNUP BUTTON =================
  const signupBtn = document.createElement("button");
  signupBtn.className =
    "w-full bg-purple-500 text-white py-3 rounded hover:bg-purple-600";
  signupBtn.textContent = "Create Vendor Account";

  signupBtn.onclick = async () => {
    errorBox.classList.add("hidden");

    const shopName = shopInput.value.trim();
    const name = nameInput.value.trim();
    const collegeName = collegeInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!shopName || !name || !collegeName || !email || !password) {
      errorBox.textContent = "All fields are required";
      errorBox.classList.remove("hidden");
      return;
    }

    try {
      signupBtn.disabled = true;
      signupBtn.textContent = "Creating account...";

      // ⚠️ IMPORTANT:
      // backend currently DOES NOT create vendor separately
      // only user signup with role=vendor

      const res = await API.post("/auth/signup", {
        name,
        email,
        password,
        collegeName,
        role: "vendor",
      });

      const data = res?.data;

      if (!data?.token) {
        throw new Error("Signup failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", "vendor");

      location.reload();
    } catch (err) {
      console.error("Vendor signup error:", err);
      errorBox.textContent = "Vendor signup failed";
      errorBox.classList.remove("hidden");
    } finally {
      signupBtn.disabled = false;
      signupBtn.textContent = "Create Vendor Account";
    }
  };

  // ================= LOGIN LINK =================
  const toggle = document.createElement("p");
  toggle.className =
    "mt-4 text-sm text-center text-blue-500 cursor-pointer";
  toggle.textContent = "Already have an account? Login";

  toggle.onclick = () => renderVendorLogin(root);

  // ================= APPEND =================
  container.append(
    title,
    errorBox,
    shopInput,
    nameInput,
    collegeInput,
    emailInput,
    passwordInput,
    signupBtn,
    toggle
  );

  root.appendChild(container);
}