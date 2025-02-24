export async function deletePost(postId) {
    try {
      const response = await fetch(`https://your-api.com/posts/${postId}`, {
        method: "DELETE"
      });
      if (!response.ok) {
        throw new Error("Failed to delete post");
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      alert("Error deleting post");
    }
  }
  