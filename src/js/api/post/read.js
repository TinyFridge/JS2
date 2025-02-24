import { API_SOCIAL_POSTS } from "../constants.js";

export async function readPosts() {
  try {
    const accessToken = JSON.parse(localStorage.getItem("user"))?.accessToken;
    const apiKey = localStorage.getItem("apiKey");

    if (!accessToken || !apiKey) {
      throw new Error("Missing authentication credentials.");
    }

    const response = await fetch(`${API_SOCIAL_POSTS}?_user=true`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
        "X-Noroff-API-Key": apiKey
      }
    });

    const responseData = await response.json();
    console.log("📌 API Response (All Posts with User Data):", responseData);

    if (!response.ok) {
      throw new Error(responseData.errors ? responseData.errors[0].message : "Failed to fetch posts");
    }

    return responseData.data;
  } catch (error) {
    console.error("❌ Read posts error:", error);
    throw error;
  }
}
