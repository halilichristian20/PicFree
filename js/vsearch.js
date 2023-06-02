const global = {
  currentPage: window.location.pathname,
};
const videosWrapper = document.querySelector(".images");

const perPage = 20;
let currentPage = 1;

// ################### Fetch videos of Search Term

async function searchVideos() {
  const urlParams = new URLSearchParams(window.location.search);
  const searchTerm = urlParams.get("search-term");
  const searchType = urlParams.get("type");

  const results = await fetchPexelVideoAPI(`&query=${searchTerm}`);

  if (searchTerm === "" || results === null) {
    showAlert("Please enter a search term");
    return;
  }

  if (results.total_results === 0) {
    showAlert(
      `No results found for <br>"<span class="text-green-500">${searchTerm}</span>" <br>Please enter a different search term`
    );
  }

  const allVideos = results.videos;

  allVideos.forEach((vid) => {
    const heading2 = document.querySelector("#search-query");
    heading2.innerHTML = `<h2>${results.total_results} total results for "${searchTerm}"</h2>`;
    const li = document.createElement("li");
    li.classList.add("card");
    li.innerHTML = `
        <video src="${vid.video_files[1].link}"
            type="video/mp4" class="vid" muted loop;">
            </video>
        <div class="details">
        <div class="photographer">
        <a href="${vid.user.url}"> <i class="fa-solid fa-camera"> </i>
        <span class="hover:underline">${vid.user.name}</span></a>
        </div>
        <button><i class="fa-solid fa-download"></i></button>
        </div>`;
    document.querySelector(".images").appendChild(li);
  });
}

// ################### Load More Videos from Pexels

async function loadMoreVideos() {
  currentPage++;
  await searchVideos();
}

// ################### Fetch Videos from Pexels

async function fetchPexelVideoAPI(query) {
  const apiUrl = `https://api.pexels.com/videos/search?${query}&page=${currentPage}&per_page=${perPage}`;
  const apiKey = "TQk1fqYBhfZj0EikkQiZSF31I3doyO7RvpZwe8I4QZpNiREVQhU2jxTJ";
  const response = await fetch(apiUrl, {
    headers: { Authorization: apiKey },
  });

  const data = await response.json();

  return data;
}

// ################### Show Alert on Search

function showAlert(message) {
  const alert = document.querySelector("#search-query");
  alert.innerHTML = message;
}

// ################### Play/pause video on mouseover/mouseout functions

function pauseVideo(e) {
  const video = e.target;
  video.pause();
}

function playVideo(e) {
  const video = e.target;
  video.play();
}

// ################### Routes

function init() {
  switch (global.currentPage) {
    case "/search-video.html":
      searchVideos();
      break;
  }
}

// ################### Event Listeners

videosWrapper.addEventListener("mouseover", (e) => {
  if (e.target.classList.contains("vid")) {
    playVideo(e);
  }
});

videosWrapper.addEventListener("mouseout", (e) => {
  if (e.target.classList.contains("vid")) {
    pauseVideo(e);
  }
});

window.addEventListener("scroll", () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight) {
    loadMoreVideos();
  }
});

document.addEventListener("DOMContentLoaded", init);
