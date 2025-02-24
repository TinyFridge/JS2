import { createPost } from "@api/create.js";
import { readPosts } from "@api/read.js";
import { updatePost } from "@api/update.js";
import { deletePost } from "@api/delete.js";

document.addEventListener("DOMContentLoaded", () => {
  loadFeed();

  const createForm = document.getElementById("create-post-form");

  createForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = document.getElementById("post-title").value.trim();
    const content = document.getElementById("post-content").value.trim();

    if (!title || !content) {
      alert("Title and content cannot be empty!");
      return;
    }

    try {
      console.log("Attempting to create post:", { title, content });
      await createPost({ title, content });
      createForm.reset();
      loadFeed();
    } catch (error) {
      console.error("Error creating post:", error);
      alert(`Failed to create post: ${error.message}`);
    }
  });
});

async function loadFeed() {
  const feedContainer = document.getElementById("post-feed");
  feedContainer.innerHTML = "<p>Loading posts...</p>";

  try {
    const posts = await readPosts();

    if (!Array.isArray(posts)) {
      throw new Error("API did not return a valid post list");
    }

    feedContainer.innerHTML = "";
    posts.forEach((post) => {
        const postEl = document.createElement("div");
        postEl.classList.add(
          "bg-white", "p-4", "rounded-xl", "shadow-lg", "overflow-hidden", "transition", "hover:shadow-xl"
        );
        postEl.innerHTML = `
          <div class="flex flex-col h-full">
            <div class="p-4 flex-grow">
              <h2 class="text-xl font-bold mb-2 text-blue-700">${post.title}</h2>
              <p class="text-gray-700">${post.content}</p>
            </div>
            <div class="p-4 bg-gray-100 flex justify-between">
              <button class="edit-btn text-blue-500 hover:text-blue-700" data-id="${post.id}">Edit</button>
              <button class="delete-btn text-red-500 hover:text-red-700" data-id="${post.id}">Delete</button>
            </div>
          </div>
        `;
        

      postEl.innerHTML = `
        <h2 class="text-xl font-bold">${post.title}</h2>
        <p>${post.content}</p>
        <div class="mt-2 flex gap-2">
          <button class="edit-btn bg-blue-500 text-white px-2 py-1 rounded" data-id="${post.id}">Edit</button>
          <button class="delete-btn bg-red-500 text-white px-2 py-1 rounded" data-id="${post.id}">Delete</button>
        </div>
      `;
      feedContainer.appendChild(postEl);
    });
  } catch (error) {
    feedContainer.innerHTML = `<p class="text-red-500">Error loading posts: ${error.message}</p>`;
    console.error("Error loading posts:", error);
  }
}
