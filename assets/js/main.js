// main.js

function handleResponsiveness() {
  const logo = document.querySelector(".logo");
  const mainContainer = document.querySelector(".main-container");
  const topBar = document.querySelector(".top-bar");
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Nav Icons
  const navIcons = document.querySelectorAll(".nav-icon");
  const iconHeight = viewportWidth < 768 ? "2.1vh" : "2.8vh";
  navIcons.forEach((icon) => {
    icon.style.height = iconHeight;
  });

  // Logo responsiveness
  const smallerDimension = Math.min(viewportWidth, viewportHeight);
  if (smallerDimension < 768) {
    logo.style.width = "75vmin";
  } else {
    logo.style.width = "73.33vmin";
  }

  // Main container responsiveness
  if (viewportWidth < 768) {
    mainContainer.style.height = "65vh";
    topBar.style.height = "58px";
  } else {
    mainContainer.style.height = "80vh";
    topBar.style.height = "52px";
  }

  // Adjust screw size based on screen width
  const screws = document.querySelectorAll(".screw");
  const screwSize = viewportWidth < 768 ? "20px" : "25px"; // Adjust these values as needed
  screws.forEach((screw) => {
    screw.style.width = screwSize;
    screw.style.height = screwSize;
  });
}

// Modify the initTabSwitching function
function initTabSwitching() {
  const navButtons = document.querySelectorAll(".nav-button");
  const contentArea = document.querySelector(".content-area");
  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const page = button.getAttribute("data-page");
      loadPage(page, contentArea);
    });
  });
  // Load default page (Home)
  loadPage("home", contentArea);
}

// Add this function to handle active state
function setActiveTab(page) {
  const navButtons = document.querySelectorAll(".nav-button");
  navButtons.forEach((button) => {
    if (button.getAttribute("data-page") === page) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });
}

// Modify the loadPage function
function loadPage(page, contentArea) {
  fetch(`assets/pages/${page}.html`)
    .then((response) => response.text())
    .then((html) => {
      contentArea.innerHTML = html;
      loadPageStyles(page);
      setActiveTab(page); // Add this line
    })
    .catch((error) => {
      console.error("Error loading page:", error);
      contentArea.innerHTML = "<p>Error loading content.</p>";
    });
}

function loadPageStyles(page) {
  const head = document.head;
  const link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = `assets/css/${page}.css`;
  head.appendChild(link);
}

window.addEventListener("load", function () {
  handleResponsiveness();
  lockOrientation();
  initTabSwitching();
});

function lockOrientation() {
  if (screen.orientation && screen.orientation.lock) {
    screen.orientation.lock("portrait").catch(function (error) {
      console.log("Orientation lock failed: ", error);
    });
  }
}

window.addEventListener("load", function () {
  handleResponsiveness();
  lockOrientation();
});

window.addEventListener("resize", handleResponsiveness);
window.addEventListener("orientationchange", lockOrientation);
