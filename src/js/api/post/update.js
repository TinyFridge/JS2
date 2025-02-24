import { API_SOCIAL_POSTS } from "../constants.js";

export async function updatePost(postId, postData) {
  try {
    const accessToken = JSON.parse(localStorage.getItem("user"))?.accessToken;
    const apiKey = localStorage.getItem("apiKey");

    if (!accessToken || !apiKey) {
      throw new Error("Missing authentication credentials");
    }

    console.log(`Updating post ID: ${postId} with data:`, postData);

    const response = await fetch(`${API_SOCIAL_POSTS}/${postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
        "X-Noroff-API-Key": apiKey
      },
      body: JSON.stringify(postData)
    });

    const responseData = await response.json();
    console.log("Update response:", responseData);

    if (!response.ok) {
      throw new Error(responseData.errors ? responseData.errors[0].message : "Failed to update post");
    }

    return responseData;
  } catch (error) {
    console.error("Update post error:", error);
    throw error;
  }
}
