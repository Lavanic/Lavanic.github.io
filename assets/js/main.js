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
