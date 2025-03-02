import { API_SOCIAL_POSTS } from "../constants.js";

/**
 * Creates a new post.
 *
 * @param {Object} postData - An object containing the post details.
 * @param {string} postData.title - The title of the post.
 * @param {string} postData.body - The content of the post.
 * @param {Object|null} postData.media - An object containing the image URL and alt text (if any), or null.
 * @returns {Promise<Object>} The API response data.
 * @throws {Error} If the user is not logged in or the API returns an error.
 */
export async function createPost(postData) {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.accessToken) {
      throw new Error("User is not logged in.");
    }
    const accessToken = user.accessToken;
    const apiKey = localStorage.getItem("apiKey");
    if (!accessToken || !apiKey) {
      throw new Error("Missing authentication credentials.");
    }

    // Tag the post with the user’s email for filtering
    postData.createdBy = user.email;
    // Optionally, add a tag using the email prefix if you want:
    postData.tags = [user.email.split("@")[0]];

    console.log("📤 Sending post request with data:", postData);

    const response = await fetch(API_SOCIAL_POSTS, {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
         "Authorization": `Bearer ${accessToken}`,
         "X-Noroff-API-Key": apiKey,
      },
      body: JSON.stringify(postData),
    });

    const responseData = await response.json();
    console.log("📩 Server Response:", responseData);

    if (!response.ok) {
      throw new Error(responseData.errors ? responseData.errors[0].message : "Failed to create post");
    }
    return responseData;
  } catch (error) {
    console.error("Create post error:", error);
    throw error;
  }
}
