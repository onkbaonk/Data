import { login } from "./auth.js";
import { loadBlog } from "./blog.js";

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

  if (tabName === "blog") await loadBlog();
}

// Init
window.onload = () => {
  setTimeout(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      const el = document.getElementById("usernameDisplay");
      if (el) el.innerText = user.username;
    }

    const btn = document.getElementById("loginBtn");
    if (btn) {
      btn.onclick = () => {
        const username = prompt("Masukkan username:");
        if (username) login(username);
      };
    }

    // load awal
    loadBlog();

  }, 300);
};