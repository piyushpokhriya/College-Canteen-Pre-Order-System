import { renderUserLogin } from "./userLogin.js";
import API from "../services/api.js";

export function renderUserSignup(root) {
  root.innerHTML = "";

  // ================= FORM CONTAINER =================
  const container = document.createElement("div");
  container.className =
    "max-w-md mx-auto mt-16 p-8 bg-white rounded shadow";

  const title = document.createElement("h2");
  title.className = "text-2xl font-bold mb-6 text-center";
  title.textContent = "Student Signup";

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

  const nameInput = createInput("text", "Full Name");
  const collegeInput = createInput("text", "College Name");
  const emailInput = createInput("email", "Email");
  const passwordInput = createInput("password", "Password");

  // ================= SIGNUP BUTTON =================
  const signupBtn = document.createElement("button");
  signupBtn.className =
    "w-full bg-green-500 text-white py-3 rounded hover:bg-green-600";
  signupBtn.textContent = "Signup";

  // ================= SIGNUP HANDLER =================
  async function handleSignup() {
    errorBox.classList.add("hidden");

    const name = nameInput.value.trim();
    const collegeName = collegeInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!name || !collegeName || !email || !password) {
      errorBox.textContent = "All fields are required";
      errorBox.classList.remove("hidden");
      return;
    }

    try {
      signupBtn.disabled = true;
      signupBtn.textContent = "Creating account...";

      const res = await API.post("/auth/signup", {
        name,
        collegeName,
        email,
        password,
        role: "student",
      });

      const data = res?.data;

      if (!data?.token) {
        throw new Error("Invalid response from server");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data?.user?.role || "student");

      if (data?.user?.collegeId) {
        localStorage.setItem("collegeId", data.user.collegeId);
      }

      location.reload();
    } catch (err) {
      console.error("Signup error:", err);
      errorBox.textContent = "Signup failed. Try again.";
      errorBox.classList.remove("hidden");
    } finally {
      signupBtn.disabled = false;
      signupBtn.textContent = "Signup";
    }
  }

  signupBtn.onclick = handleSignup;

  // ================= ENTER KEY SIGNUP =================
  container.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      handleSignup();
    }
  });

  // ================= LOGIN LINK =================
  const toggle = document.createElement("p");
  toggle.className =
    "mt-4 text-sm text-center text-blue-500 cursor-pointer";
  toggle.textContent = "Already have an account? Login";

  toggle.onclick = () => renderUserLogin(root);

  // ================= APPEND =================
  container.append(
    title,
    errorBox,
    nameInput,
    collegeInput,
    emailInput,
    passwordInput,
    signupBtn,
    toggle
  );

  root.appendChild(container);
}