import API from "../services/api.js";

export function renderAdminLogin(root) {
  root.innerHTML = "";

  const container = document.createElement("div");
  container.className =
    "max-w-md mx-auto mt-16 p-8 bg-white rounded shadow";

  const title = document.createElement("h2");
  title.textContent = "Admin Login";
  title.className = "text-2xl font-bold mb-6 text-center";

  // EMAIL
  const email = document.createElement("input");
  email.type = "email";
  email.placeholder = "Email";
  email.className = "w-full p-3 mb-4 border rounded";

  // PASSWORD
  const password = document.createElement("input");
  password.type = "password";
  password.placeholder = "Password";
  password.className = "w-full p-3 mb-4 border rounded";

  // ERROR
  const error = document.createElement("p");
  error.className = "text-red-500 text-sm mb-3 hidden";

  // BUTTON
  const btn = document.createElement("button");
  btn.textContent = "Login";
  btn.className = "w-full bg-yellow-500 text-white py-3 rounded";

  btn.onclick = async () => {
    error.classList.add("hidden");

    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();

    if (!emailValue || !passwordValue) {
      error.textContent = "All fields required";
      error.classList.remove("hidden");
      return;
    }

    try {
      btn.disabled = true;
      btn.textContent = "Logging in...";

      const res = await API.post("/auth/login", {
        email: emailValue,
        password: passwordValue,
      });

      const data = res.data;

      if (!data.token || !data.user) {
        throw new Error("Invalid response");
      }

      if (data.user.role !== "admin") {
        throw new Error("Not admin");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("collegeId", data.user.collegeId);

      location.reload();
    } catch (err) {
      console.error(err);
      error.textContent = "Invalid credentials";
      error.classList.remove("hidden");
    } finally {
      btn.disabled = false;
      btn.textContent = "Login";
    }
  };

  container.append(title, error, email, password, btn);
  root.appendChild(container);
}