import { authGuard } from "../../utilities/authGuard";
import { readPosts } from "@api/read.js";
import { deletePost } from "@api/delete.js";
import { updatePost } from "@api/update.js";

authGuard();

document.addEventListener("DOMContentLoaded", async () => {
  const userEmailEl = document.getElementById("user-email");

  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.email) {
      console.warn("No user data found.");
      userEmailEl.textContent = "User data not found.";
      return;
    }
    const userEmail = user.email;
    console.log("Logged in as:", userEmail);
    userEmailEl.textContent = `Email: ${userEmail}`;

    await loadMyPosts(userEmail);
  } catch (error) {
    console.error("Error loading profile:", error);
    userEmailEl.textContent = "Error loading profile data.";
  }

  document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("user");
    localStorage.removeItem("apiKey");
    window.location.href = "/index.html";
  });
});

async function loadMyPosts(userEmail) {
  const myPostsContainer = document.getElementById("my-posts");
  myPostsContainer.innerHTML = "<p>Loading your posts...</p>";

  try {
    const posts = await readPosts();
    console.log("All posts fetched:", posts);
    if (!Array.isArray(posts)) {
      throw new Error("Invalid API response format");
    }
    const username = userEmail.split("@")[0];
    console.log("Filtering posts for username:", username);

    const userPosts = posts.filter(post =>
      Array.isArray(post.tags) && post.tags.includes(username)
    );
    console.log("Filtered user posts:", userPosts);

    if (userPosts.length === 0) {
      myPostsContainer.innerHTML = "<p class='text-gray-500'>You haven't created any posts yet.</p>";
      return;
    }

    myPostsContainer.innerHTML = "";
    userPosts.forEach(post => {
      const contentText = (post.body && post.body.trim() !== "")
        ? post.body
        : ((post.content && post.content.trim() !== "") ? post.content : "No content available");
      
      const imageHTML = (post.media && post.media.url)
        ? `<img src="${post.media.url}" alt="${post.media.alt || "Post image"}" class="w-full h-auto mb-2 rounded">`
        : "";

      const postEl = document.createElement("div");
      postEl.classList.add("bg-white", "p-4", "rounded-xl", "shadow-lg", "mb-4");

      postEl.innerHTML = `
        <h2 class="text-xl font-bold">${post.title}</h2>
        ${imageHTML}
        <p>${contentText}</p>
        <small class="text-gray-500">Created: ${new Date(post.created).toLocaleString()}</small>
        <div class="mt-2 flex gap-2">
          <button class="edit-btn bg-blue-500 text-white px-2 py-1 rounded" data-id="${post.id}">Edit</button>
          <button class="delete-btn bg-red-500 text-white px-2 py-1 rounded" data-id="${post.id}">Delete</button>
        </div>
      `;

      postEl.setAttribute("data-original-content", post.body || post.content || "");
      postEl.setAttribute("data-original-media", post.media ? JSON.stringify(post.media) : "");

      myPostsContainer.appendChild(postEl);
    });

    attachProfileEventListeners();
  } catch (error) {
    console.error("Error loading posts:", error);
    myPostsContainer.innerHTML = `<p class='text-red-500'>Error loading posts: ${error.message}</p>`;
  }
}

function attachProfileEventListeners() {
  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", async (e) => {
      const postId = e.target.getAttribute("data-id");
      if (confirm("Are you sure you want to delete this post?")) {
        try {
          await deletePost(postId);
          await loadMyPosts(JSON.parse(localStorage.getItem("user")).email);
        } catch (error) {
          console.error("Error deleting post:", error);
          alert(`Failed to delete post: ${error.message}`);
        }
      }
    });
  });

  document.querySelectorAll(".edit-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const postEl = e.target.closest("div.bg-white");
      const postId = e.target.getAttribute("data-id");

      document.querySelectorAll(".edit-panel").forEach(panel => panel.remove());

      const originalTitle = postEl.querySelector("h2").textContent;
      const originalContent = postEl.getAttribute("data-original-content");
      let originalMedia = "";
      try {
        originalMedia = JSON.parse(postEl.getAttribute("data-original-media")).url || "";
      } catch {
        originalMedia = "";
      }

      const editForm = document.createElement("div");
      editForm.classList.add("edit-panel", "mt-4", "p-4", "bg-gray-50", "rounded");
      editForm.innerHTML = `
        <input type="text" class="edit-title w-full p-2 border rounded mb-2" value="${originalTitle}">
        <textarea class="edit-content w-full p-2 border rounded mb-2">${originalContent}</textarea>
        <input type="text" class="edit-image w-full p-2 border rounded mb-2" placeholder="Image URL (optional)" value="${originalMedia}">
        <button class="save-edit bg-green-600 text-white px-4 py-2 rounded" data-id="${postId}">Save</button>
        <button class="cancel-edit bg-gray-600 text-white px-4 py-2 rounded">Cancel</button>
      `;

      postEl.appendChild(editForm);

      editForm.querySelector(".save-edit").addEventListener("click", async () => {
        const newTitle = editForm.querySelector(".edit-title").value.trim();
        const newContent = editForm.querySelector(".edit-content").value.trim();
        const newImage = editForm.querySelector(".edit-image").value.trim();

        if (!newTitle || !newContent) {
          alert("Title and content cannot be empty.");
          return;
        }

        try {
          await updatePost(postId, { 
            title: newTitle, 
            body: newContent, 
            media: newImage ? { url: newImage, alt: "" } : null 
          });
          await loadMyPosts(JSON.parse(localStorage.getItem("user")).email);
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
}
