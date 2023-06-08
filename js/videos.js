const global = {
  currentPage: window.location.pathname,
};
const videosWrapper = document.querySelector(".images");

const perPage = 20;
let currentPage = 2;

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

// ########## Download Video

const downloadVid = (vidURL) => {
  dlName = "video.mp4";
  fetch(vidURL)
    .then((res) => res.blob())
    .then((file) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(file);
      a.download = dlName;
      a.click();
    })
    .catch(() => alert("Failed to download the video!"));
};

// Display videos via Pexels

async function generateVideo() {
  const results = await fetchPexelVideoAPI();
  const allVideos = results.videos;

  console.log(allVideos);
  allVideos.forEach((vid) => {
    const modalId = `defaultModal${vid.id}`;
    const li = document.createElement("li");
    li.classList.add("card");
    li.innerHTML = `
    <video src="${vid.video_files[1].link}"
                type="video/mp4" 
                data-modal-target="${modalId}"
                data-modal-toggle="${modalId}"
                class="vid" muted loop;">
                </video>
            <div class="details">
            <div class="photographer">
            <a href="${vid.user.url}"> <i class="uil uil-camera"></i>
            <span class="mt-2">${vid.user.name}</span></a>
            </div>
            <button onclick="downloadVid('${vid.video_files[2].link}')"><i class="uil uil-import"></i></button>
            </div>

            <!-- Main modal -->
                <div
                  id="${modalId}"
                  tabindex="-1"
                  aria-hidden="true"
                  class="modalBackdrop flex items-center justify-center fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden md:inset-0 h-min"
                >
                  <div class="relative w-full max-w-2xl max-h-full my-12" id="modal-body">
                    <!-- Modal content -->
                    <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                      <!-- Modal header -->
                      <div
                        class="flex items-center justify-between px-4 pt-4 rounded-t dark:border-gray-600"
                      > 
                      
                        <button
                          type="button"
                          class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                          data-modal-hide="${modalId}"
                        >
                          <svg
                            class="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clip-rule="evenodd"
                            ></path>
                          </svg>
                        </button>
                      </div>
                      <!-- Modal body -->
                      <div class="flex items-center justify-center p-4 space-y-6">
                      <video src="${vid.video_files[2].link}"
                      type="video/mp4" class="vid" controls loop;">
                      </video>
                        
                    </div>
    
                    <div
                      class="flex items-center justify-between px-4 pb-5 space-x-2 border-gray-200 rounded-b dark:border-gray-600"
                    id="modal-footer">
                    <div class="photographer">
            <a href="${vid.user.url}"> <i class="uil uil-camera text-black dark:text-white"></i>
            <p
                      class="text-black font-medium dark:text-white mt-2"
                      >${vid.user.name}</p></a>
            </div>
                  <button onclick="downloadVid('${vid.video_files[1].link}')"
                    class="text-black-400 bg-gray-300 hover:bg-gray-400 rounded-lg text-xl p-1.5 ml-auto inline-flex items-center dark:text-gray-900 dark:hover:bg-gray-100 dark:hover:text-white"
                  >
                    <i class="uil uil-import px-2"></i>
                  </button>
                    </div>
                    
                  </div>
                </div>
    `;
    document.querySelector(".images").appendChild(li);
    showAndHideModal();
  });
}

function showAndHideModal() {
  const modalHideButtons = document.querySelectorAll("[data-modal-hide]");
  const displayImageModal = document.querySelectorAll("[data-modal-target]");

  modalHideButtons.forEach((button) => {
    button.addEventListener("click", hideModal);
  });

  displayImageModal.forEach((img) => {
    img.addEventListener("click", showModal);
  });
}

function hideModal() {
  const modalId = this.getAttribute("data-modal-hide");
  const modalElement = document.getElementById(modalId);
  modalElement.classList.add("hidden");
  modalElement.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "auto";
}

function showModal() {
  const imageId = this.getAttribute("data-modal-target");
  const modal = document.getElementById(imageId);
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
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

generateVideo();
displayRandomBG();

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
