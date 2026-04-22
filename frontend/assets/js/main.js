import { login } from "./auth.js";
import { loadBlog } from "./blog.js";

// Modal
function openModal(id) {
  document.getElementById(id).style.display = "flex";
}

function closeModal(id) {
  document.getElementById(id).style.display = "none";
}

// Tab navigation
async function switchTab(tabName) {
  document.querySelectorAll(".tab-content").forEach(el => el.classList.add("hidden"));
  document.getElementById("section-" + tabName).classList.remove("hidden");

  const tabs = ["blog", "categories", "chat", "stats", "profile"];
  tabs.forEach(t => {
    const el = document.getElementById("tab-" + t);
    if (!el) return;

    if (t === tabName) {
      el.classList.add("border-blue-500", "text-blue-400", "font-bold");
    } else {
      el.classList.remove("border-blue-500", "text-blue-400", "font-bold");
    }
  });

  // 🔥 FIX: pakai API
  if (tabName === "blog") await loadBlog();
}

// Init
window.onload = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    document.getElementById("usernameDisplay").innerText = user.username;
  }

  document.getElementById("loginBtn").onclick = () => {
    const username = prompt("Masukkan username:");
    if (username) login(username);
  };

  // 🔥 AUTO LOAD BLOG SAAT MASUK
  loadBlog();
};