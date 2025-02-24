export async function createPost(postData) {
    try {
      const response = await fetch("https://your-api.com/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData)
      });
      if (!response.ok) {
        throw new Error("Failed to create post");
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      alert("Error creating post");
    }
  }
  