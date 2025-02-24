import { createPost } from "../../api/post/create.js";
import { readPosts } from "../../api/post/read.js";
import { updatePost } from "../../api/post/update.js";
import { deletePost } from "../../api/post/delete.js";

document.addEventListener("DOMContentLoaded", async () => {
  loadFeed();


  const createBtn = document.getElementById("create-post-btn");
  createBtn.addEventListener("click", async () => {

    const newPost = { title: "New Post", content: "This is the post content" };
    await createPost(newPost);
    loadFeed();
  });
});

async function loadFeed() {
  const feedContainer = document.getElementById("post-feed");
  feedContainer.innerHTML = "<p>Loading posts...</p>";

  try {
    const posts = await readPosts();
    feedContainer.innerHTML = "";
    posts.forEach(post => {
      const postElement = document.createElement("div");
      postElement.classList.add("bg-white", "p-4", "rounded", "shadow");
      postElement.innerHTML = `
        <h2 class="text-xl font-bold">${post.title}</h2>
        <p>${post.content}</p>
        <div class="mt-2 flex gap-2">
          <button data-id="${post.id}" class="edit-btn bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
          <button data-id="${post.id}" class="delete-btn bg-red-500 text-white px-2 py-1 rounded">Delete</button>
        </div>
      `;
      feedContainer.appendChild(postElement);
    });

  
    document.querySelectorAll(".delete-btn").forEach(button => {
      button.addEventListener("click", async (e) => {
        const postId = e.target.getAttribute("data-id");
        if (confirm("Are you sure you want to delete this post?")) {
          await deletePost(postId);
          loadFeed();
        }
      });
    });


    document.querySelectorAll(".edit-btn").forEach(button => {
      button.addEventListener("click", async (e) => {
        const postId = e.target.getAttribute("data-id");


        const updatedPost = { title: "Updated Title", content: "Updated content" };
        await updatePost(postId, updatedPost);
        loadFeed();
      });
    });
  } catch (error) {
    feedContainer.innerHTML = "<p>Failed to load posts</p>";
    console.error(error);
  }
}
