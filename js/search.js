const global = {
  currentPage: window.location.pathname,
};
const perPage = 20;
let currentPage = 1;

const API_KEY = "XYT5T3yPOk1cO09fCRPeoJGqg2u8ct25prLl69N3dlI";
const API_URL = "https://api.unsplash.com";

async function searchImages() {
  const urlParams = new URLSearchParams(window.location.search);

  const searchTerm = urlParams.get("search-term");

  console.log(searchTerm);

  const { results, total, total_pages } = await fetchAPIData(
    `/search/photos?query=${searchTerm}`
  );

  if (searchTerm === "" || results.length === null) {
    showAlert("Please enter a search term");
    return;
  }

  if (total === 0) {
    showAlert(
      `No results found for <br>"<span class="text-green-500">${searchTerm}</span>" <br>Please enter a different search term`
    );
  }

  console.log(window);
  results.forEach((img) => {
    const li = document.createElement("li");
    const heading2 = document.querySelector("#search-query");
    heading2.innerHTML = `<h2>${total} total results for "${searchTerm}"</h2>`;
    li.classList.add("card");
    li.innerHTML = `
      <img src="${img.urls.regular}" alt="img">
      <div class="details">
          <div class="photographer">
          <a href="${img.user.links.html}"> <img id="profile-image" src="${img.user.profile_image.small}" alt=img style="width:30px")>
          <span class="hover:underline">${img.user.name}</span></a>
          </div>
          <button><i class="fa-solid fa-download"></i></button>
          </div>
      `;
    document.querySelector(".images").appendChild(li);
  });
}

function showAlert(message) {
  const alert = document.querySelector("#search-query");
  alert.innerHTML = message;
}

async function loadMoreImages() {
  currentPage++;
  await searchImages();
}

async function fetchAPIData(endpoint, query) {
  const response = await fetch(
    `${API_URL}${endpoint}&page=${currentPage}&per_page=${perPage}&client_id=${API_KEY}`
  );
  const data = await response.json();

  return data;
}

// Highlight Active Link

function highlightActiveLink() {
  const links = document.querySelectorAll(".nav-link");
  links.forEach((link) => {
    if (link.getAttribute("href") === global.currentPage) {
      link.classList.add("active");
    }
  });
}

function init() {
  switch (global.currentPage) {
    case "/search-image.html":
      searchImages();
      break;
  }
  highlightActiveLink();
}

window.addEventListener("scroll", () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight) {
    loadMoreImages();
  }
});

document.addEventListener("DOMContentLoaded", init);
