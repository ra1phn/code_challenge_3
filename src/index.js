const BASE_URL = "http://localhost:3000/posts"; // API endpoint for posts
const postList = document.getElementById("post-list"); // Container for post list
const postDetail = document.getElementById("post-detail"); // Container for post details
const postCount = document.getElementById("post-count"); // Element to display post count
const form = document.getElementById("new-post-form"); // Form for creating new posts

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  displayPosts(); // Fetch and display all posts
  form.addEventListener("submit", handleNewPost); // Handle new post submissions
});

// Fetch and display all posts
function displayPosts() {
  fetch(BASE_URL)
    .then(res => res.json())
    .then(posts => {
      postList.innerHTML = ""; // Clear current list and brings it as empty
      postCount.textContent = `${posts.length} posts`; // Update post count

      // Create a div for each post and add to list for styling
      posts.forEach(post => {
        const div = document.createElement("div");
        div.className = "post-item";
        div.textContent = `${post.title}`;
        div.addEventListener("click", () => showPostDetail(post)); // Show details on click
        postList.appendChild(div);
      });

      if (posts.length > 0) showPostDetail(posts[0]); // Show first post by default
    });
}

// Display details for a single post
function showPostDetail(post) {
  postDetail.innerHTML = `
    <h2>${post.title}</h2>
    <p class="post-meta">By ${post.author} • ${post.date || "No date"}</p>
    ${post.image ? `<img src="${post.image}" alt="${post.title}">` : ""}
    <p>${post.content}</p>
    <div class="post-actions">
      <button class="edit-btn">Edit</button>
      <button class="delete-btn">Delete</button>
    </div>
  `;

  // Add event listener for delete button
  postDetail.querySelector(".delete-btn").addEventListener("click", () => deletePost(post.id));
}

// Handle new post form submission
function handleNewPost(e) {
  e.preventDefault(); // Prevent default form submission
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const image = document.getElementById("image").value;
  const content = document.getElementById("content").value;
  const today = new Date().toISOString().split("T")[0]; // Get today's date

  const newPost = { title, author, image, content, date: today }; // Create new post object

  // Send POST request to create new post
  fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newPost)
  })
    .then(res => res.json())
    .then(() => {
      form.reset(); // Reset form fields
      displayPosts(); // Refresh post list
    });
}

// Delete a post by ID
function deletePost(id) {
  fetch(`${BASE_URL}/${id}`, {
    method: "DELETE"
  })
    .then(() => {
      postDetail.innerHTML = "<p>Post deleted. Select another post.</p>"; // Show delete message
      displayPosts(); // Refresh post list
    });
}
