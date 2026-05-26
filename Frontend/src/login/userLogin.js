import { renderUserSignup } from "./userSignup.js";
import API from "../services/api.js";

export function renderUserLogin(root) {
  root.innerHTML = "";

  // ================= CONTAINER =================
  const container = document.createElement("div");
  container.className =
    "max-w-md mx-auto mt-16 p-8 bg-white rounded shadow";

  const title = document.createElement("h2");
  title.className = "text-2xl font-bold mb-6 text-center";
  title.textContent = "Student Login";

  // ================= ERROR BOX =================
  const errorBox = document.createElement("p");
  errorBox.className = "text-red-500 text-sm mb-3 hidden";

  // ================= INPUTS =================
  const collegeInput = document.createElement("input");
  collegeInput.type = "text";
  collegeInput.placeholder = "College Name";
  collegeInput.className = "w-full p-3 mb-4 border rounded";

  const emailInput = document.createElement("input");
  emailInput.type = "email";
  emailInput.placeholder = "Email";
  emailInput.className = "w-full p-3 mb-4 border rounded";

  const passwordInput = document.createElement("input");
  passwordInput.type = "password";
  passwordInput.placeholder = "Password";
  passwordInput.className = "w-full p-3 mb-4 border rounded";

  // ================= LOGIN BUTTON =================
  const loginBtn = document.createElement("button");
  loginBtn.className =
    "w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600";
  loginBtn.textContent = "Login";

  // ================= LOGIN HANDLER =================
  async function handleLogin() {
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

      const token = data?.token;
      const user = data?.user;

      if (!token) {
        throw new Error("Token not received");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", user?.role || "student");

      if (user?.collegeId) {
        localStorage.setItem("collegeId", user.collegeId);
      }

      location.reload();
    } catch (err) {
      console.error("Login error:", err);
      errorBox.textContent = "Login failed. Check credentials.";
      errorBox.classList.remove("hidden");
    } finally {
      loginBtn.disabled = false;
      loginBtn.textContent = "Login";
    }
  }

  loginBtn.onclick = handleLogin;

  // ================= ENTER KEY LOGIN =================
  container.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  });

  // ================= SIGNUP LINK =================
  const toggle = document.createElement("p");
  toggle.className =
    "mt-4 text-sm text-center text-blue-500 cursor-pointer";
  toggle.textContent = "Don't have an account? Signup";

  toggle.onclick = () => renderUserSignup(root);

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