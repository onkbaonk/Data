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

export async function addBlog(title, content) {
  try {
    await api("/blog/add", "POST", { title, content });
    loadBlog();
  } catch (err) {
    console.error("Gagal tambah blog:", err);
  }
}
function viewPost(title, content, postId) {
    document.getElementById('viewTitle').innerText = title;
    document.getElementById('viewContent').innerHTML = content;
    document.getElementById('viewModal').setAttribute('data-current-post-id', postId);
    renderComments(postId);
    openModal('viewModal');
}
function resetPostModal() {
    EDIT_POST_ID = null;
    document.getElementById('postTitle').value = "";
    document.getElementById('postContent').value = "";
    document.querySelector('#postModal h2').innerText = "📝 Tulis Postingan";
    document.getElementById('btnSubmitPost').innerText = "Terbitkan";
    document.getElementById('btnSubmitPost').onclick = submitPost; // Kembalikan ke fungsi awal
}
const availableCategories = ["Semua", "Teknologi", "Catatan", "Tutorial", "Curhat", "Umum"];

async function refreshCategories(filter = "Semua") {
    // 1. Render Baris Tombol Filter
    const filterBar = document.getElementById('category-filter-bar');
    filterBar.innerHTML = availableCategories.map(cat => `
        <button onclick="refreshCategories('${cat}')" 
            class="px-4 py-1 rounded-full text-[10px] whitespace-nowrap border ${filter === cat ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white/5 border-white/10 text-slate-400'}">
            ${cat}
        </button>
    `).join('');

    try {
        const file = await getGithubFile('blog_data.json');
        let filtered = file.content;
        
        // 2. Filter data
        if (filter !== "Semua") {
            filtered = file.content.filter(p => p.category === filter);
        }

        // 3. Render ke UI (Hanya Judul agar rapi)
        const container = document.getElementById('category-posts');
        if (filtered.length === 0) {
            container.innerHTML = `<p class='text-center opacity-30 py-10 text-xs'>Tidak ada postingan di kategori ${filter}.</p>`;
            return;
        }

        container.innerHTML = filtered.reverse().map(p => {
            const safeTitle = p.title.replace(/'/g, "\\'").replace(/"/g, '&quot;');
            const safeContent = p.content.replace(/\n/g, '<br>').replace(/'/g, "\\'").replace(/"/g, '&quot;');
            return `
                <div class="glass p-4 rounded-xl flex justify-between items-center group cursor-pointer" onclick="viewPost('${safeTitle}', '${safeContent}', ${p.id})">
                    <div>
                        <span class="text-[8px] bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded mb-1 inline-block">${p.category || 'Umum'}</span>
                        <h4 class="font-bold text-sm text-slate-200"># ${p.title}</h4>
                    </div>
                    <div class="text-blue-500">→</div>
                </div>`;
        }).join('');
    } catch (e) { console.error(e); }
}
async function handleReaction(postId, type) {
    try {
        const file = await getGithubFile('blog_data.json');
        const idx = file.content.findIndex(p => p.id === postId);
        if (idx === -1) return;
        if (!file.content[idx].reactions) file.content[idx].reactions = {};
        
        if (file.content[idx].reactions[CURRENT_USER] === type) {
            delete file.content[idx].reactions[CURRENT_USER];
        } else {
            file.content[idx].reactions[CURRENT_USER] = type;
        }
        await updateGithubFile('blog_data.json', file.content, file.sha, `Reaction ${type}`);
        refreshBlog();
    } catch (e) { console.error(e); }
}
async function renderComments(postId) {
    const list = document.getElementById('comment-list');
    list.innerHTML = "<p class='text-[10px] opacity-30'>Loading...</p>";
    try {
        const file = await getGithubFile('blog_data.json');
        const post = file.content.find(p => p.id === postId);
        if (!post.comments || post.comments.length === 0) {
            list.innerHTML = "<p class='text-[10px] opacity-30 italic'>Belum ada komentar.</p>";
            return;
        }
        list.innerHTML = post.comments.map(c => `
            <div class="bg-white/5 p-2 rounded-lg border border-white/5 mb-2">
                <div class="flex justify-between text-[9px] mb-1">
                    <span class="text-blue-400 font-bold">@${c.user}</span>
                    <span class="opacity-30">${c.date}</span>
                </div>
                <p class="text-[10px] opacity-80">${c.text}</p>
            </div>
        `).join('');
    } catch (e) { list.innerHTML = "Error."; }
}

async function addComment() {
    const input = document.getElementById('commentInput');
    const text = input.value.trim();
    const postId = parseInt(document.getElementById('viewModal').getAttribute('data-current-post-id'));
    if (!text || CURRENT_USER === "guest") return;
    try {
        const file = await getGithubFile('blog_data.json');
        const idx = file.content.findIndex(p => p.id === postId);
        if (!file.content[idx].comments) file.content[idx].comments = [];
        file.content[idx].comments.push({ user: CURRENT_USER, text: text, date: new Date().toLocaleDateString() });
        await updateGithubFile('blog_data.json', file.content, file.sha, "New Comment");
        input.value = "";
        renderComments(postId);
    } catch (e) { alert("Gagal!"); }
}
function filterBlog() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const posts = document.querySelectorAll('#blog-feed > div'); // Mengambil semua kartu postingan

    posts.forEach(post => {
        // Cari teks judul di dalam kartu (biasanya tag h3)
        const title = post.querySelector('h3').innerText.toLowerCase();
        
        if (title.includes(query)) {
            post.style.display = "block"; // Tampilkan jika cocok
        } else {
            post.style.display = "none";  // Sembunyikan jika tidak cocok
        }
    });

    // Tampilkan pesan jika tidak ada hasil
    const existingNoResult = document.getElementById('no-search-result');
    const visiblePosts = Array.from(posts).filter(p => p.style.display !== "none").length;

    if (visiblePosts === 0) {
        if (!existingNoResult) {
            const msg = document.createElement('p');
            msg.id = 'no-search-result';
            msg.className = 'text-center opacity-40 text-xs py-10';
            msg.innerText = "Postingan tidak ditemukan.";
            document.getElementById('blog-feed').appendChild(msg);
        }
    } else {
        if (existingNoResult) existingNoResult.remove();
    }
}