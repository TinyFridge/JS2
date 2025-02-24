import { API_SOCIAL_POSTS } from "../constants.js";

export async function createPost(postData) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.email) {
    throw new Error("User is not logged in.");
  }

  const accessToken = user?.accessToken;
  const apiKey = localStorage.getItem("apiKey");

  if (!accessToken || !apiKey) {
    throw new Error("Missing authentication credentials.");
  }

  const username = user.email.split("@")[0].substring(0, 24);

  const postPayload = {
    ...postData,
    tags: [username]
  };

  console.log("📤 Sending post request with data:", postPayload);

  const response = await fetch(API_SOCIAL_POSTS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
      "X-Noroff-API-Key": apiKey
    },
    body: JSON.stringify(postPayload)
  });

  const responseData = await response.json();
  console.log("📩 Server Response:", responseData);

  if (!response.ok) {
    throw new Error(responseData.errors ? responseData.errors[0].message : "Failed to create post");
  }

  return responseData;
}
