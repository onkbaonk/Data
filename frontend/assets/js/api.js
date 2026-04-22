const API_URL = "https://data-production-90d4.up.railway.app";

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