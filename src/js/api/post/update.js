import { API_SOCIAL_POSTS } from "../constants.js";

export async function readPosts() {
  try {
    const response = await fetch(API_SOCIAL_POSTS, {
      method: "PUT",
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error("Failed to fetch posts");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    alert("Error fetching posts");
    return [];
  }
}
