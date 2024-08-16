// main.js

function handleResponsiveness() {
  const logo = document.querySelector(".logo");
  const mainContainer = document.querySelector(".main-container");
  const topBar = document.querySelector(".top-bar");
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

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

  // Adjust button font size based on screen width
  const navButtons = document.querySelectorAll(".nav-button");
  const fontSize = viewportWidth < 768 ? "12px" : "20px"; // Adjust these values as needed
  navButtons.forEach((button) => {
    button.style.fontSize = fontSize;
  });

  // Adjust screw size based on screen width
  const screws = document.querySelectorAll(".screw");
  const screwSize = viewportWidth < 768 ? "20px" : "30px"; // Adjust these values as needed
  screws.forEach((screw) => {
    screw.style.width = screwSize;
    screw.style.height = screwSize;
  });
}

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
