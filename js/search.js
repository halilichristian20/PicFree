const global = {
  currentPage: window.location.pathname,
};
const videosWrapper = document.querySelector(".images");

const perPage = 20;
let currentPage = 1;

// ################### Fetch videos of Search Term

async function searchForPhotosOrVideos() {
  const urlParams = new URLSearchParams(window.location.search);
  const searchTerm = urlParams.get("search-term");
  const searchType = urlParams.get("type");

  console.log(searchType);
  console.log(searchTerm);

  if (searchType === "video") {
    const videoRadio = document.querySelector("#video");
    videoRadio.setAttribute("checked", "checked");
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
  } else if (searchType === "photo") {
    const photoRadio = document.querySelector("#photo");
    photoRadio.setAttribute("checked", "checked");
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
}

// ################### Load More Photos/Videos from Unsplash/Pexels

async function loadMore() {
  currentPage++;
  await searchForPhotosOrVideos();
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

// ################### Fetch Images from Unsplash

async function fetchAPIData(endpoint) {
  const API_KEY = "F_AlrteKQ31bG2Gz9qt6eP94IkHZdOjnYQafFuuKFGc";
  const API_URL = "https://api.unsplash.com";
  const response = await fetch(
    `${API_URL}${endpoint}&page=${currentPage}&per_page=${perPage}&client_id=${API_KEY}`
  );
  const data = await response.json();

  return data;
}

// ########## Dark Mode & localStorage

const darkToggle = document.querySelector("#darkModeButton");
const targetBody = document.querySelector("body");
let theme = localStorage.getItem("theme");
if (theme != null) {
  targetBody.classList.toggle("dark");
}

function switchThemeMode() {
  darkToggle.addEventListener("click", () => {
    let theme = localStorage.getItem("theme");
    if (theme != null) {
      localStorage.removeItem("theme");
    } else {
      localStorage.setItem("theme", "dark");
    }

    targetBody.classList.toggle("dark");
  });
}
switchThemeMode();
// ################### Show Alert on Search

function showAlert(message) {
  const alert = document.querySelector("#search-query");
  alert.classList.add("h-screen");
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

searchForPhotosOrVideos();

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
    loadMoreImages();
  }
});

window.addEventListener("scroll", () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight) {
    loadMore();
  }
});
