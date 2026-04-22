import { api } from "./api.js";

export async function loadBlog() {
  try {
    const posts = await api("/blog/all");

    const container = document.getElementById("blogList");
    if (!container) return;

    container.innerHTML = "";

    if (!posts || posts.length === 0) {
      container.innerHTML = "<p class='text-center opacity-50'>Belum ada postingan.</p>";
      return;
    }

    posts.forEach(p => {
      const el = document.createElement("div");
      el.className = "glass p-4 rounded-xl mb-3";

      el.innerHTML = `
        <h3 class="font-bold text-blue-400">${p.title || "No title"}</h3>
        <p class="text-sm opacity-80 mt-1">${p.content || ""}</p>
      `;

      container.appendChild(el);
    });

  } catch (err) {
    console.error("Gagal load blog:", err);
  }
}
