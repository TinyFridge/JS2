import { readPosts } from "@api/read.js";
import { createPost } from "@api/create.js";
import { deletePost } from "@api/delete.js";
import { updatePost } from "@api/update.js";

async function handleCreatePost(event) {
    event.preventDefault();
    
    const title = document.getElementById("post-title").value.trim();
    const content = document.getElementById("post-content").value.trim();
    
    if (!title || !content) {
      alert("Title and content cannot be empty.");
      return;
    }
  
    try {
      const postData = { title, content };
      await createPost(postData);
      
      // Clear input fields after successful post creation
      document.getElementById("post-title").value = "";
      document.getElementById("post-content").value = "";
  
      // Reload posts to show the new one
      await loadPosts();
    } catch (error) {
      console.error("Error creating post:", error);
      alert(`Failed to create post: ${error.message}`);
    }
  }
  

document.addEventListener("DOMContentLoaded", async () => {
    console.log("🚀 Feed Page Loaded");
  
    await loadPosts();
  
    document.getElementById("create-post-form")?.addEventListener("submit", handleCreatePost);
    document.getElementById("filter-options")?.addEventListener("change", applyFilters);
    document.getElementById("search-posts")?.addEventListener("input", applyFilters);
    document.getElementById("close-modal")?.addEventListener("click", closeModal);
    document.getElementById("logout-btn")?.addEventListener("click", handleLogout);
  });
  

async function loadPosts() {
  const postContainer = document.getElementById("post-feed");
  postContainer.innerHTML = "<p>Loading posts...</p>";

  try {
    const posts = await readPosts();
    console.log("📌 All posts from API:", posts);

    renderPosts(posts);
  } catch (error) {
    console.error("❌ Error loading posts:", error);
    postContainer.innerHTML = `<p class='text-red-500'>Error loading posts: ${error.message}</p>`;
  }
}

function renderPosts(posts) {
  const postContainer = document.getElementById("post-feed");
  postContainer.innerHTML = "";

  if (!Array.isArray(posts)) {
    console.error("❌ API returned invalid data:", posts);
    postContainer.innerHTML = "<p class='text-red-500'>Error: Invalid post data received.</p>";
    return;
  }

  if (posts.length === 0) {
    postContainer.innerHTML = "<p class='text-gray-500'>No posts found.</p>";
    return;
  }

  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.email.split("@")[0].substring(0, 24);

  posts.forEach(post => {
    const postEl = document.createElement("div");
    postEl.classList.add("bg-white", "p-4", "rounded-xl", "shadow-lg");

    const isUserPost = post.tags.includes(username);
    const editDeleteButtons = isUserPost
      ? `<button class="edit-btn bg-blue-500 text-white px-2 py-1 rounded" data-id="${post.id}">Edit</button>
         <button class="delete-btn bg-red-500 text-white px-2 py-1 rounded" data-id="${post.id}">Delete</button>`
      : "";

    postEl.innerHTML = `
      <h2 class="text-xl font-bold">${post.title}</h2>
      <p>${post.content}</p>
      <small class="text-gray-500">Created: ${new Date(post.created).toLocaleString()}</small>
      <div class="mt-2 flex gap-2">
        <button class="view-btn bg-gray-500 text-white px-2 py-1 rounded" data-id="${post.id}">View</button>
        ${editDeleteButtons}
      </div>
    `;

    postContainer.appendChild(postEl);
  });

  attachPostEventListeners();
}

function attachPostEventListeners() {
  document.querySelectorAll(".view-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const postId = e.target.getAttribute("data-id");
      openModal(postId);
    });
  });

  document.querySelectorAll(".edit-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const postEl = e.target.closest("div.bg-white");
      const postId = e.target.getAttribute("data-id");

      document.querySelectorAll(".edit-panel").forEach(panel => panel.remove());

      const editForm = document.createElement("div");
      editForm.classList.add("edit-panel", "mt-4", "p-4", "bg-gray-50", "rounded");

      editForm.innerHTML = `
        <input type="text" class="edit-title w-full p-2 border rounded mb-2" value="${postEl.querySelector("h2").textContent}">
        <textarea class="edit-content w-full p-2 border rounded mb-2">${postEl.querySelector("p").textContent}</textarea>
        <button class="save-edit bg-green-600 text-white px-4 py-2 rounded" data-id="${postId}">Save</button>
        <button class="cancel-edit bg-gray-600 text-white px-4 py-2 rounded">Cancel</button>
      `;

      postEl.appendChild(editForm);

      editForm.querySelector(".save-edit").addEventListener("click", async () => {
        const newTitle = editForm.querySelector(".edit-title").value.trim();
        const newContent = editForm.querySelector(".edit-content").value.trim();

        if (!newTitle || !newContent) {
          alert("Title and content cannot be empty.");
          return;
        }

        try {
          await updatePost(postId, { title: newTitle, content: newContent });
          await loadPosts();
        } catch (error) {
          console.error("Error updating post:", error);
          alert(`Failed to update post: ${error.message}`);
        }
      });

      editForm.querySelector(".cancel-edit").addEventListener("click", () => {
        editForm.remove();
      });
    });
  });

  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", async (e) => {
      const postId = e.target.getAttribute("data-id");

      if (confirm("Are you sure you want to delete this post?")) {
        try {
          await deletePost(postId);
          await loadPosts();
        } catch (error) {
          console.error("Error deleting post:", error);
          alert(`Failed to delete post: ${error.message}`);
        }
      }
    });
  });
}

async function openModal(postId) {
  try {
    const posts = await readPosts();
    const post = posts.find(p => p.id == postId);

    if (!post) {
      alert("Post not found.");
      return;
    }

    document.getElementById("modal-title").textContent = post.title;
    document.getElementById("modal-content").textContent = post.content;
    document.getElementById("modal-date").textContent = `Created: ${new Date(post.created).toLocaleString()}`;

    document.getElementById("post-modal").classList.remove("hidden");

    document.getElementById("close-modal").addEventListener("click", closeModal);
  } catch (error) {
    console.error("Error opening modal:", error);
    alert("Failed to load post details.");
  }
}

function closeModal() {
  console.log("🛑 Closing modal...");
  const modal = document.getElementById("post-modal");
  modal.classList.add("hidden");
}

async function applyFilters() {
    console.log("🔍 Applying filters...");
    
    const filterOption = document.getElementById("filter-options")?.value;
    const searchQuery = document.getElementById("search-posts")?.value.toLowerCase();
    const user = JSON.parse(localStorage.getItem("user"));
    const username = user?.email.split("@")[0].substring(0, 24);
  
    try {
      let posts = await readPosts();
      console.log("📌 Original posts:", posts);
  
      if (filterOption === "my-posts") {
        posts = posts.filter(post => post.tags.includes(username));
      }
  
      if (filterOption === "recent") {
        posts.sort((a, b) => new Date(b.created) - new Date(a.created));
      }
  
      if (filterOption === "most-liked") {
        posts.sort((a, b) => (b._count?.reactions || 0) - (a._count?.reactions || 0));
      }

      if (searchQuery) {
        posts = posts.filter(post =>
          post.title.toLowerCase().includes(searchQuery) ||
          (post.content && post.content.toLowerCase().includes(searchQuery))
        );
      }
  
      console.log("📌 Filtered posts:", posts);
      
      renderPosts(posts);
    } catch (error) {
      console.error("❌ Error filtering posts:", error);
    }
  }
  
  function handleLogout() {
    console.log("🚪 Logging out...");
    localStorage.removeItem("user");
    localStorage.removeItem("apiKey");
    window.location.href = "/index.html";
  }
  
  