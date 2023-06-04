// Primary Client-ID: XYT5T3yPOk1cO09fCRPeoJGqg2u8ct25prLl69N3dlI
// Secondary Client ID: F_AlrteKQ31bG2Gz9qt6eP94IkHZdOjnYQafFuuKFGc

const global = {
  currentPage: window.location.pathname,
};
const perPage = 15;
let currentPage = 1;

const API_KEY = "XYT5T3yPOk1cO09fCRPeoJGqg2u8ct25prLl69N3dlI";
const API_URL = "https://api.unsplash.com";

// ########## Display Random Background

async function displayRandomBG() {
  const results = await fetchAPIRandom("/photos/random");
  console.log(results);
  const background = document.querySelector("#hero");
  background.style.background = `url(${results.urls.full})`;
  background.style.backgroundSize = "cover";
  background.style.backgroundPosition = "center";
  background.style.backgroundRepeat = "no-repeat";
  background.style.backgroundColor;
}

const downloadImg = (imgURL) => {
  dlName = "image.jpg";
  fetch(imgURL)
    .then((res) => res.blob())
    .then((file) => {
      console.log(file);
      const a = document.createElement("a");
      a.href = URL.createObjectURL(file);
      a.download = dlName;
      a.click();
    })
    .catch(() => alert("Failed to download the image!"));
};
// ########## Display Images

async function displayImages() {
  const results = await fetchAPIData("/photos");
  imagesWrapper = document.querySelector(".images");

  imagesWrapper.innerHTML += results
    .map(
      (img) => `<li class="card"><img src="${img.urls.regular}" alt="img">
      <div class="details">
          <div class="photographer">
          <a href="${img.user.links.html}"> <img id="profile-image" src="${img.user.profile_image.small}" alt="img" style="width:30px")>
          <span class="hover:underline">${img.user.name}</span></a>
          </div>
          <button onclick="downloadImg('${img.urls.regular}')">
          <i class="fa-solid fa-download"></i></button>
          </div></li>
          `
    )
    .join("");
}

// ########## Load More Images

async function loadMoreImages() {
  currentPage++;
  await displayImages();
}

// ########## GET images from Unpslash API

async function fetchAPIData(endpoint, query) {
  const response = await fetch(
    `${API_URL}${endpoint}?page=${currentPage}&per_page=${perPage}&client_id=${API_KEY}`
  );
  const data = await response.json();

  return data;
}

// ########## GET a random image from Unpslash API

async function fetchAPIRandom(endpoint) {
  const response = await fetch(
    `${API_URL}${endpoint}?query=bright?orientation=landscape&client_id=${API_KEY}`
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

displayImages();
// displayRandomBG();

// ########## Event Listeners

window.addEventListener("scroll", () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 6) {
    loadMoreImages();
  }
});
