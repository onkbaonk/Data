import { api } from "./api.js";

export async function login(username) {
  const res = await api("/auth/login", "POST", { username });

  if (res.error) {
    alert("Login gagal: " + res.error);
    return;
  }

  localStorage.setItem("user", JSON.stringify(res.user));

  // update UI
  document.getElementById("usernameDisplay").innerText = res.user.username;

  console.log("Login sukses:", res.user);
}