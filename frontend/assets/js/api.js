const API_URL = "https://your-backend.up.railway.app"; // ganti ini

export async function api(path, method = "GET", data = null) {
  try {
    const res = await fetch(API_URL + path, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: data ? JSON.stringify(data) : null
    });

    if (!res.ok) {
      throw new Error("API error: " + res.status);
    }

    return await res.json();
  } catch (err) {
    console.error("API ERROR:", err);
    return { error: "Server tidak merespon" };
  }
}