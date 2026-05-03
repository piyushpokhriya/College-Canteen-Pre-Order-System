import API from "../services/api.js";

export function renderAdminLogin(root) {
  root.innerHTML = "";

  const container = document.createElement("div");
  container.className =
    "max-w-md mx-auto mt-16 p-8 bg-white rounded shadow";

  const title = document.createElement("h2");
  title.textContent = "Admin Login";
  title.className = "text-2xl font-bold mb-6 text-center";

  // ================= INPUTS =================
  const collegeInput = document.createElement("input");
  collegeInput.type = "text";
  collegeInput.placeholder = "College Name";
  collegeInput.className = "w-full p-3 mb-4 border rounded";

  const email = document.createElement("input");
  email.type = "email";
  email.placeholder = "Email";
  email.className = "w-full p-3 mb-4 border rounded";

  const password = document.createElement("input");
  password.type = "password";
  password.placeholder = "Password";
  password.className = "w-full p-3 mb-4 border rounded";

  // ================= ERROR =================
  const error = document.createElement("p");
  error.className = "text-red-500 text-sm mb-3 hidden";

  // ================= BUTTON =================
  const btn = document.createElement("button");
  btn.textContent = "Login";
  btn.className =
    "w-full bg-yellow-500 text-white py-3 rounded";

  // ================= LOGIN HANDLER =================
  btn.onclick = async () => {
    error.classList.add("hidden");

    const collegeName = collegeInput.value.trim();
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();

    if (!collegeName || !emailValue || !passwordValue) {
      error.textContent = "All fields required";
      error.classList.remove("hidden");
      return;
    }

    try {
      btn.disabled = true;
      btn.textContent = "Logging in...";

      const res = await API.post("/auth/login", {
        collegeName,
        email: emailValue,
        password: passwordValue
      });

      // ===== SAFE RESPONSE HANDLING =====
      const data = res?.data;

      const token = data?.token;
      const user = data?.user;

      // ===== ADMIN ROLE CHECK =====
      if (!token || !user || user.role !== "admin") {
        throw new Error("Not authorized as admin");
      }

      // ===== STORE SESSION =====
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);

      location.reload();

    } catch (err) {
      console.error("Admin login error:", err);
      error.textContent = "Invalid admin credentials";
      error.classList.remove("hidden");
    } finally {
      btn.disabled = false;
      btn.textContent = "Login";
    }
  };

  container.append(title, error, collegeInput, email, password, btn);
  root.appendChild(container);
}