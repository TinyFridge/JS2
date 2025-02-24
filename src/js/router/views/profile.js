import { authGuard } from "../../utilities/authGuard.js";
import { readPosts } from "@api/read.js";
import { deletePost } from "@api/delete.js";
import { updatePost } from "@api/update.js";

authGuard();

document.addEventListener("DOMContentLoaded", async () => {
  const userEmailEl = document.getElementById("user-email");

  try {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.email) {
      console.warn("No user email found in localStorage. Redirecting to login.");
      userEmailEl.textContent = "User data not found.";
      return;
    }

    const userEmail = user.email;
    console.log("Logged in as:", userEmail);

    userEmailEl.textContent = `Email: ${userEmail}`;

    await loadMyPosts(userEmail);
  } catch (error) {
    console.error("An error occurred while loading the profile:", error);
    userEmailEl.textContent = "Error loading profile data.";
  }

  document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/index.html";
  });
});

async function loadMyPosts(userEmail) {
  const myPostsContainer = document.getElementById("my-posts");
  myPostsContainer.innerHTML = "<p>Loading your posts...</p>";

  try {
    const posts = await readPosts();
    console.log("All posts fetched from API:", posts);

    if (!Array.isArray(posts)) {
      throw new Error("Invalid data format from API.");
    }

    const username = userEmail.split("@")[0];
    console.log("Filtering posts by username:", username);

    const userPosts = posts.filter(post =>
      Array.isArray(post.tags) && post.tags.includes(username)
    );

    if (userPosts.length === 0) {
      console.log("No posts found for the user.");
      myPostsContainer.innerHTML = "<p class='text-gray-500'>You haven't created any posts yet.</p>";
      return;
    }

    myPostsContainer.innerHTML = "";
    userPosts.forEach(post => {
      const postEl = document.createElement("div");
      postEl.classList.add("bg-white", "p-4", "rounded-xl", "shadow-lg", "mb-4");

      postEl.innerHTML = `
        <h2 class="text-xl font-bold">${post.title}</h2>
        <p>${post.content || "No content available"}</p>
        <div class="mt-2 flex gap-2">
          <button class="edit-btn bg-blue-500 text-white px-2 py-1 rounded" data-id="${post.id}">Edit</button>
          <button class="delete-btn bg-red-500 text-white px-2 py-1 rounded" data-id="${post.id}">Delete</button>
        </div>
        <div class="edit-form mt-2 hidden p-4 bg-gray-50 rounded">
          <input type="text" class="edit-title w-full p-2 border rounded mb-2" value="${post.title}" />
          <textarea class="edit-content w-full p-2 border rounded mb-2">${post.content || ""}</textarea>
          <button class="save-edit bg-green-600 text-white px-4 py-2 rounded w-full" data-id="${post.id}">Save</button>
          <button class="cancel-edit bg-gray-600 text-white px-4 py-2 rounded w-full" data-id="${post.id}">Cancel</button>
        </div>
      `;

      myPostsContainer.appendChild(postEl);
    });

    attachProfileEventListeners();
  } catch (error) {
    console.error("Error loading my posts:", error);
    myPostsContainer.innerHTML = `<p class='text-red-500'>Error loading posts: ${error.message}</p>`;
  }
}

function attachProfileEventListeners() {
  document.querySelectorAll(".edit-btn").forEach(button => {
    button.addEventListener("click", (e) => {
      const parent = e.target.closest("div.bg-white");
      const editForm = parent.querySelector(".edit-form");
      editForm.classList.remove("hidden");
    });
  });

  document.querySelectorAll(".cancel-edit").forEach(button => {
    button.addEventListener("click", (e) => {
      const editForm = e.target.closest(".edit-form");
      editForm.classList.add("hidden");
    });
  });

  document.querySelectorAll(".save-edit").forEach(button => {
    button.addEventListener("click", async (e) => {
      const postId = e.target.getAttribute("data-id");
      const editForm = e.target.closest(".edit-form");
      const newTitle = editForm.querySelector(".edit-title").value.trim();
      const newContent = editForm.querySelector(".edit-content").value.trim();

      if (!newTitle || !newContent) {
        alert("Title and content cannot be empty.");
        return;
      }

      try {
        await updatePost(postId, { title: newTitle, content: newContent });
        loadMyPosts(JSON.parse(localStorage.getItem("user")).email);
      } catch (error) {
        console.error("Error updating post:", error);
        alert(`Failed to update post: ${error.message}`);
      }
    });
  });

  document.querySelectorAll(".delete-btn").forEach(button => {
    button.addEventListener("click", async (e) => {
      const postId = e.target.getAttribute("data-id");

      if (confirm("Are you sure you want to delete this post?")) {
        try {
          await deletePost(postId);
          loadMyPosts(JSON.parse(localStorage.getItem("user")).email);
        } catch (error) {
          console.error("Error deleting post:", error);
          alert(`Failed to delete post: ${error.message}`);
        }
      }
    });
  });
}
