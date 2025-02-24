import { API_SOCIAL_POSTS } from "@constants";

export async function updatePost(postId, postData) {
  try {
    const accessToken = JSON.parse(localStorage.getItem("user")).accessToken;
    const apiKey = localStorage.getItem("apiKey");
    const response = await fetch(`${API_SOCIAL_POSTS}/${postId}`, {
      method: "PUT", // Or use PATCH if preferred
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
        "X-Noroff-API-Key": apiKey
      },
      body: JSON.stringify(postData)
    });
    if (!response.ok) {
      throw new Error("Failed to update post");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}
