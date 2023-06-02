const global = {
  currentPage: window.location.pathname,
};
const videosWrapper = document.querySelector(".images");

const perPage = 20;
let currentPage = 1;

// Display a random background from /photos/random via Unplash

async function displayRandomBG() {
  const results = await fetchAPIRandom("/photos/random");
  const background = document.querySelector("#hero");
  background.style.background = `url(${results.urls.full})`;
  background.style.backgroundSize = "cover";
  background.style.backgroundPosition = "center";
  background.style.backgroundRepeat = "no-repeat";
}

const API_KEY = "XYT5T3yPOk1cO09fCRPeoJGqg2u8ct25prLl69N3dlI";
const API_URL = "https://api.unsplash.com";

// Display videos via Pexels

async function generateVideo() {
  const results = await fetchPexelVideoAPI();
  const allVideos = results.videos;
  allVideos.forEach((vid) => {
    const li = document.createElement("li");
    li.classList.add("card");
    li.innerHTML = `
    <video src="${vid.video_files[1].link}"
        type="video/mp4" class="vid" muted loop;">
        </video>
    <div class="details">
    <div class="photographer">
    <a href="${vid.user.url}"><i class="fa-solid fa-camera"></i>
    <span class="hover:underline">${vid.user.name}</span></a>
          </div>
          <button><i class="fa-solid fa-download"></i></button>
          </div>`;
    document.querySelector(".images").appendChild(li);
  });
}

// ################### Display Random Background from Unplash

async function fetchAPIRandom(endpoint) {
  const response = await fetch(
    `${API_URL}${endpoint}?query=dark?orientation=landscape&client_id=${API_KEY}`
  );

  const data = await response.json();

  return data;
}

// ################### Fetch Videos from Pexels

async function fetchPexelVideoAPI() {
  const apiUrl = `https://api.pexels.com/videos/popular?page=${currentPage}&per_page=${perPage}`;
  const apiKey = "TQk1fqYBhfZj0EikkQiZSF31I3doyO7RvpZwe8I4QZpNiREVQhU2jxTJ";
  const response = await fetch(apiUrl, {
    headers: { Authorization: apiKey },
  });

  const data = await response.json();

  return data;
}

// ################### Load More Videos from Pexels

async function loadMoreVideos() {
  currentPage++;
  await generateVideo();
}

// ################### Play/pause video functions
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
    case "/videos.html":
      generateVideo();
      displayRandomBG();
      break;
  }
  //   highlightActiveLink();
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
  if (scrollTop + clientHeight >= scrollHeight - 6) {
    loadMoreVideos();
  }
});

document.addEventListener("DOMContentLoaded", init);
