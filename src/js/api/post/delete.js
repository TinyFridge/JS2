import { API_SOCIAL_POSTS } from "../constants.js";

export async function deletePost(postId) {
  try {
    const accessToken = JSON.parse(localStorage.getItem("user"))?.accessToken;
    const apiKey = localStorage.getItem("apiKey");

    if (!accessToken || !apiKey) {
      throw new Error("Missing authentication credentials");
    }

    console.log(`Deleting post with ID: ${postId}`);

    const response = await fetch(`${API_SOCIAL_POSTS}/${postId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
        "X-Noroff-API-Key": apiKey
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error deleting post:", errorData);
      throw new Error(errorData.errors ? errorData.errors[0].message : "Failed to delete post");
    }

    console.log("Post deleted successfully.");
  } catch (error) {
    console.error("Delete post error:", error);
    throw error;
  }
}
