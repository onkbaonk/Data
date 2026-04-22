const API_URL = "https://data-production-90d4.up.railway.app";

export async function api(path, method = "GET", body = null) {
  try {
    const res = await fetch(API_URL + path, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: body ? JSON.stringify(body) : null
    });

    return await res.json();
  } catch (err) {
    console.error("API Error:", err);
    return null;
  }
}