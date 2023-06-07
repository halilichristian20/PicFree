const global = {
  currentPage: window.location.pathname,
};
const videosWrapper = document.querySelector(".images");

const perPage = 20;
let currentPage = 1;

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

    console.log(allVideos);

    allVideos.forEach((vid) => {
      const heading2 = document.querySelector("#search-query");
      heading2.innerHTML = `<h2>${results.total_results} total results for "${searchTerm}"</h2>`;
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
            <span id="name">${vid.user.name}</span></a>
            </div>
            <button><i class="uil uil-import"></i></button>
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
                      <video src="${vid.video_files[1].link}"
                      type="video/mp4" class="vid" controls loop;">
                      </video>
                        
                    </div>
    
                    <div
                      class="flex items-center justify-between px-4 pb-6 space-x-2 border-gray-200 rounded-b dark:border-gray-600"
                    id="modal-footer">
                    <div class="photographer">
            <a href="${vid.user.url}"> <i class="uil uil-camera"></i>
            <span id="name">${vid.user.name}</span></a>
            </div>
                  <button onclick="downloadImg('${vid.video_files[1].link}}')"
                    class="text-black-400 bg-gray-300 hover:bg-gray-400 rounded-lg text-xl p-1.5 ml-auto inline-flex items-center dark:text-gray-900 dark:hover:bg-gray-100 dark:hover:text-white"
                  >
                    <i class="uil uil-import px-2"></i>
                  </button>
                    </div>
                    
                  </div>
                </div>
            
            `;
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
      const modalId = `defaultModal${img.id}`;

      li.classList.add("card");
      li.innerHTML = `
          <img src="${img.urls.regular}"
          data-modal-target="${modalId}"
          data-modal-toggle="${modalId}"
          type="button"
          alt="img">
          <div class="details">
              <div class="photographer">
              <a href="${img.user.links.html}"> <img id="profile-image" src="${img.user.profile_image.small}" alt=img style="width:30px")>
              <span id="name">${img.user.name}</span></a>
              </div>
              <button><i class="uil uil-import"></i></button>
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
                      > <span class="dark:text-white" id="modal-likes"><i class="fa-regular fa-heart fa-xl"> </i>  ${img.likes}</span>
                      <a href="https://www.instagram.com/${img.user.social.instagram_username}" class="ml-12 ">
                      <span class="dark:text-white" id="modal-social">
                      <i class="fa-brands fa-instagram fa-xl"></i> ${img.user.social.instagram_username}
                      </span>
                      </a>
    
                      
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
                      <div class="p-4 space-y-6">
                        <img src="${img.urls.regular}" alt="img" class="rounded"  />
                        
                    </div>
    
                    <div
                      class="flex items-center justify-between px-4 pb-6 space-x-2 border-gray-200 rounded-b dark:border-gray-600"
                    id="modal-footer">
                    <div class="photographer">
                    <a href="${img.user.links.html}">
                      <img
                        id="profile-image"
                        src="${img.user.profile_image.small}"
                        alt="img"
                        style="width: 35px; height: 30px"
                      />
                    
                    <p
                      class="text-black font-medium dark:text-white" id="modal-span"
                      >${img.user.name}</p></a>
                  </div>
                  <button onclick="downloadImg('${img.urls.regular}')"
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

// ################### Load More Photos/Videos from Unsplash/Pexels

async function loadMore() {
  currentPage++;
  await searchForPhotosOrVideos();
  showAndHideModal();
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
    loadMore();
  }
});
