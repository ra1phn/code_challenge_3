const BASE_URL = "http://localhost:3000/posts";
const postList = document.getElementById("post-list");
const postDetail = document.getElementById("post-detail");
const postCount = document.getElementById("post-count");
const form = document.getElementById("new-post-form");

document.addEventListener("DOMContentLoaded", () => {
  displayPosts();
  form.addEventListener("submit", handleNewPost);
});

function displayPosts() {
  fetch(BASE_URL)
    .then(res => res.json())
    .then(posts => {
      postList.innerHTML = "";
      postCount.textContent = `${posts.length} posts`;

      posts.forEach(post => {
        const div = document.createElement("div");
        div.className = "post-item";
        div.textContent = `${post.title}`;
        div.addEventListener("click", () => showPostDetail(post));
        postList.appendChild(div);
      });

      if (posts.length > 0) showPostDetail(posts[0]);
    });
}

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

  postDetail.querySelector(".delete-btn").addEventListener("click", () => deletePost(post.id));
}

function handleNewPost(e) {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const image = document.getElementById("image").value;
  const content = document.getElementById("content").value;
  const today = new Date().toISOString().split("T")[0];

  const newPost = { title, author, image, content, date: today };

  fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newPost)
  })
    .then(res => res.json())
    .then(() => {
      form.reset();
      displayPosts();
    });
}

function deletePost(id) {
  fetch(`${BASE_URL}/${id}`, {
    method: "DELETE"
  })
    .then(() => {
      postDetail.innerHTML = "<p>Post deleted. Select another post.</p>";
      displayPosts();
    });
}
