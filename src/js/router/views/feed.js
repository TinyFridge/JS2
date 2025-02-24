import { createPost } from "@api/create.js";
import { readPosts } from "@api/read.js";
import { updatePost } from "@api/update.js";
import { deletePost } from "@api/delete.js";

document.addEventListener("DOMContentLoaded", () => {
  loadFeed();

  const createForm = document.getElementById("create-post-form");
  if (createForm) {
    createForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const title = document.getElementById("post-title").value.trim();
      const content = document.getElementById("post-content").value.trim();

      if (!title || !content) {
        alert("Title and content cannot be empty!");
        return;
      }

      try {
        console.log("Creating post:", { title, content });
        await createPost({ title, content });
        createForm.reset();
        loadFeed();
      } catch (error) {
        console.error("Error creating post:", error);
        alert(`Failed to create post: ${error.message}`);
      }
    });
  }

  document.getElementById("search-input").addEventListener("input", loadFeed);
  document.getElementById("filter-select").addEventListener("change", loadFeed);
});

async function loadFeed() {
  const feedContainer = document.getElementById("post-feed");
  const filter = document.getElementById("filter-select")?.value;
  const searchTerm = document.getElementById("search-input")?.value.toLowerCase();

  feedContainer.innerHTML = "<p>Loading posts...</p>";

  try {
    let posts = await readPosts();
    const userEmail = JSON.parse(localStorage.getItem("user"))?.email;

    if (filter === "mine") {
      posts = posts.filter(post => post.author === userEmail);
    }

    if (searchTerm) {
      posts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm)
      );
    }

    feedContainer.innerHTML = "";
    posts.forEach(post => {
      const postEl = document.createElement("div");
      postEl.classList.add("bg-white", "p-4", "rounded-xl", "shadow-lg");

      postEl.innerHTML = `
        <h2 class="text-xl font-bold">${post.title}</h2>
        <p>${post.content}</p>
        <div class="mt-2 flex gap-2">
          <button class="view-post bg-gray-500 text-white px-2 py-1 rounded" data-id="${post.id}">View</button>
          <button class="edit-btn bg-blue-500 text-white px-2 py-1 rounded" data-id="${post.id}">Edit</button>
          <button class="delete-btn bg-red-500 text-white px-2 py-1 rounded" data-id="${post.id}">Delete</button>
        </div>
        <!-- Hidden Edit Form -->
        <div class="edit-form mt-2 hidden p-4 bg-gray-50 rounded">
          <input type="text" class="edit-title w-full p-2 border rounded mb-2" value="${post.title}" />
          <textarea class="edit-content w-full p-2 border rounded mb-2">${post.content}</textarea>
          <button class="save-edit bg-green-600 text-white px-4 py-2 rounded w-full" data-id="${post.id}">Save</button>
          <button class="cancel-edit bg-gray-600 text-white px-4 py-2 rounded w-full" data-id="${post.id}">Cancel</button>
        </div>
      `;
      feedContainer.appendChild(postEl);
    });

    attachEventListeners();
  } catch (error) {
    feedContainer.innerHTML = `<p class="text-red-500">Error loading posts: ${error.message}</p>`;
    console.error("Error loading posts:", error);
  }
}

function attachEventListeners() {
  document.querySelectorAll(".view-post").forEach((button) => {
    button.addEventListener("click", (e) => {
      const postId = e.target.getAttribute("data-id");
      showPostModal(postId);
    });
  });

  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", async (e) => {
      const postId = e.target.getAttribute("data-id");

      if (confirm("Are you sure you want to delete this post?")) {
        try {
          await deletePost(postId);
          loadFeed();
        } catch (error) {
          console.error("Error deleting post:", error);
          alert(`Failed to delete post: ${error.message}`);
        }
      }
    });
  });

  document.querySelectorAll(".edit-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const parent = e.target.closest("div.bg-white");
      const editForm = parent.querySelector(".edit-form");
      editForm.classList.remove("hidden");
    });
  });

  document.querySelectorAll(".cancel-edit").forEach((button) => {
    button.addEventListener("click", (e) => {
      const editForm = e.target.closest(".edit-form");
      editForm.classList.add("hidden");
    });
  });

  document.querySelectorAll(".save-edit").forEach((button) => {
    button.addEventListener("click", async (e) => {
      const postId = e.target.getAttribute("data-id");
      const editForm = e.target.closest(".edit-form");
      const newTitle = editForm.querySelector(".edit-title").value.trim();
      const newContent = editForm.querySelector(".edit-content").value.trim();

      if (newTitle && newContent) {
        try {
          console.log(`Updating post ${postId} with title: ${newTitle} and content: ${newContent}`);
          await updatePost(postId, { title: newTitle, content: newContent });
          loadFeed();
        } catch (error) {
          console.error("Error updating post:", error);
          alert(`Failed to update post: ${error.message}`);
        }
      }
    });
  });
}

async function showPostModal(postId) {
  try {
    const posts = await readPosts();
    const post = posts.find(p => p.id == postId);

    if (!post) {
      alert("Post not found.");
      return;
    }

    const modal = document.createElement("div");
    modal.classList.add("fixed", "top-0", "left-0", "w-full", "h-full", "bg-gray-900", "bg-opacity-50", "flex", "justify-center", "items-center");
    modal.innerHTML = `
      <div class="bg-white p-6 rounded-xl shadow-lg max-w-3xl w-full">
        <h1 class="text-2xl font-bold">${post.title}</h1>
        <p class="text-gray-700 mt-2">${post.content}</p>
        <button class="close-modal mt-4 bg-red-500 text-white px-4 py-2 rounded">Close</button>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector(".close-modal").addEventListener("click", () => {
      modal.remove();
    });
  } catch (error) {
    console.error("Error loading post:", error);
    alert("Failed to load post.");
  }
}
