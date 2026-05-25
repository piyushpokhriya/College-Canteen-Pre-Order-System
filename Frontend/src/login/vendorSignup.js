import { renderVendorLogin } from "./vendorLogin.js";
import API from "../services/api.js";

export function renderVendorSignup(root) {
  root.innerHTML = "";

  const container = document.createElement("div");
  container.className =
    "max-w-md mx-auto mt-16 p-8 bg-white rounded shadow";

  const title = document.createElement("h2");
  title.className = "text-2xl font-bold mb-6 text-center";
  title.textContent = "Vendor Signup";

  const messageBox = document.createElement("p");
  messageBox.className = "text-sm mb-4 hidden";

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

  const signupBtn = document.createElement("button");
  signupBtn.className =
    "w-full bg-purple-600 text-white py-3 rounded hover:bg-purple-700";
  signupBtn.textContent = "Create Vendor Account";

  signupBtn.onclick = async () => {
    messageBox.className = "text-sm mb-4 hidden";

    const shopName = shopInput.value.trim();
    const name = nameInput.value.trim();
    const collegeName = collegeInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!shopName || !name || !collegeName || !email || !password) {
      messageBox.textContent = "All fields are required";
      messageBox.className = "text-red-500 text-sm mb-4";
      return;
    }

    try {
      signupBtn.disabled = true;
      signupBtn.textContent = "Creating Account...";

      const res = await API.post("/auth/signup", {
      shopName,
      name,
      email,
      password,
      collegeName,
      role: "vendor",
    });

      messageBox.textContent =
        res.data.msg ||
        "Vendor account created. Waiting for admin approval.";

      messageBox.className =
        "text-green-600 text-sm mb-4";

    } catch (err) {
      console.error(err);

      messageBox.textContent =
        err?.response?.data?.msg ||
        "Vendor signup failed";

      messageBox.className =
        "text-red-500 text-sm mb-4";
    } finally {
      signupBtn.disabled = false;
      signupBtn.textContent = "Create Vendor Account";
    }
  };

  const toggle = document.createElement("p");
  toggle.className =
    "mt-4 text-sm text-center text-blue-600 cursor-pointer";

  toggle.textContent =
    "Already have an account? Login";

  toggle.onclick = () => {
    renderVendorLogin(root);
  };

  container.append(
    title,
    messageBox,
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