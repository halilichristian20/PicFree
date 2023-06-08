const accessKey = "8klWUq5IPAOI6Im4E3Mj3FVKjngnDs93hvr-bn_R-uw";

let page = 1;
let per_page = 20;

// ##### API - Collections
async function fetchCollection() {
  const res = await fetch(
    `https://api.unsplash.com/collections?client_id=${accessKey}&page=${page}&per_page=${per_page}`
  );
  const data = await res.json();
  console.log(data);
  return data;
}

// ########## Back-to-top

let mybutton = document.getElementById("btn-back-to-top");

window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

mybutton.addEventListener("click", backToTop);

function backToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// Random Background

const API_KEY = "F_AlrteKQ31bG2Gz9qt6eP94IkHZdOjnYQafFuuKFGc";
const API_URL = "https://api.unsplash.com";

async function fetchAPIRandom(endpoint) {
  const response = await fetch(
    `${API_URL}${endpoint}?query=dark?orientation=landscape&client_id=${API_KEY}`
  );

  const data = await response.json();

  return data;
}

// ########## Display Random Background

async function displayRandomBG() {
  const results = await fetchAPIRandom("/photos/random");
  console.log(results);
  const background = document.querySelector("#hero");
  background.style.background = `url(${results.urls.full})`;
  background.style.backgroundSize = "cover";
  background.style.backgroundPosition = "center";
  background.style.backgroundRepeat = "no-repeat";
}

// Display Collection
async function displayCollection() {
  const collection = await fetchCollection();

  collection.forEach((photo) => {
    const div = document.createElement("div");

    // max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700

    div.innerHTML = `<a class="" href="${photo.links.html}">
    <img class="rounded-t-lg h-96 w-full" src="${photo.cover_photo.urls.full}" alt="img" />
    </a>
  <div class="p-2">
    <a href="${photo.links.html}">
    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-300">${photo.title}</h5>
    </a>
    <p class="mb-2 font-normal text-gray-700 dark:text-gray-400">${photo.total_photos} photos - Curated by PicFree+ Collections</p>`;

    document.querySelector("#collections-wrapper").appendChild(div);
  });
}

// ########## Dark Mode & localStorage

if (
  localStorage.getItem("color-theme") === "dark" ||
  (!("color-theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

let themeToggleDarkIcon = document.getElementById("theme-toggle-dark-icon");
let themeToggleLightIcon = document.getElementById("theme-toggle-light-icon");

// Change the icons inside the button based on previous settings
if (
  localStorage.getItem("color-theme") === "dark" ||
  (!("color-theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  themeToggleLightIcon.classList.remove("hidden");
} else {
  themeToggleDarkIcon.classList.remove("hidden");
}

let themeToggleBtn = document.getElementById("theme-toggle");

themeToggleBtn.addEventListener("click", function () {
  // toggle icons inside button
  themeToggleDarkIcon.classList.toggle("hidden");
  themeToggleLightIcon.classList.toggle("hidden");

  // if set via local storage previously
  if (localStorage.getItem("color-theme")) {
    if (localStorage.getItem("color-theme") === "light") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("color-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("color-theme", "light");
    }

    // if NOT set via local storage previously
  } else {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("color-theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("color-theme", "dark");
    }
  }
});

// Load Collection Timer
function loadCollection() {
  setTimeout(() => {
    page++;
    displayCollection();
  }, 100);
}
displayCollection();
displayRandomBG();

// Scroll Collection
window.addEventListener("scroll", () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 6) {
    loadCollection();
  }
});
