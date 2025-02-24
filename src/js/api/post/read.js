import { API_SOCIAL_POSTS } from "../constants.js";

export async function readPosts() {
  try {
    const accessToken = JSON.parse(localStorage.getItem("user"))?.accessToken;
    const apiKey = localStorage.getItem("apiKey");

    if (!accessToken || !apiKey) {
      throw new Error("Missing authentication credentials");
    }

    console.log("Fetching posts from API...");

    const response = await fetch(API_SOCIAL_POSTS, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
        "X-Noroff-API-Key": apiKey
      }
    });

    const responseData = await response.json();
    console.log("Posts received:", responseData);

    if (!response.ok) {
      throw new Error(responseData.errors ? responseData.errors[0].message : "Failed to fetch posts");
    }

    return responseData.data; // Ensure it returns the post array
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
}
