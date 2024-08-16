// main.js

function handleResponsiveness() {
  const logo = document.querySelector(".logo");
  const mainContainer = document.querySelector(".main-container");
  const topBar = document.querySelector(".top-bar");
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Nav Icons
  const navIcons = document.querySelectorAll(".nav-icon");
  const iconHeight = viewportWidth < 768 ? "20%" : "35%";
  navIcons.forEach((icon) => {
    icon.style.height = iconHeight;
  });

  // Logo responsiveness
  const smallerDimension = Math.min(viewportWidth, viewportHeight);
  if (smallerDimension < 768) {
    logo.style.width = "60vmin";
  } else {
    logo.style.width = "73.33vmin";
  }

  // Main container responsiveness
  if (viewportWidth < 768) {
    mainContainer.style.height = "65vh";
    topBar.style.height = "54px";
  } else {
    mainContainer.style.height = "80vh";
    topBar.style.height = "52px";
  }

  // Adjust screw size based on screen width
  const screws = document.querySelectorAll(".screw");
  const screwSize = viewportWidth < 768 ? "15px" : "25px"; // Adjust these values as needed
  screws.forEach((screw) => {
    screw.style.width = screwSize;
    screw.style.height = screwSize;
  });
}

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

function loadPage(page, contentArea) {
  fetch(`assets/pages/${page}.html`)
    .then((response) => response.text())
    .then((html) => {
      contentArea.innerHTML = html;
      loadPageStyles(page);
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
