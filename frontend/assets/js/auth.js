import { api } from "./api.js";

export async function login(username) {
  try {
    const res = await api("/auth/login", "POST", { username });

    if (res && res.username) {
      localStorage.setItem("user", JSON.stringify(res));
      alert("Login berhasil!");
      location.reload();
    } else {
      alert("Login gagal!");
    }

  } catch (err) {
    console.error("Login error:", err);
  }
}