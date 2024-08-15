// main.js

// Function to handle the responsive behavior of the logo
function handleLogoResponsiveness() {
  const logo = document.querySelector(".logo");
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Use the smaller dimension to ensure logo fits in both orientations
  const smallerDimension = Math.min(viewportWidth, viewportHeight);

  if (smallerDimension < 768) {
    logo.style.width = "70vmin"; // 70% of the smaller viewport dimension
  } else {
    logo.style.width = "33.33vmin"; // Approximately 1/3 of the smaller viewport dimension
  }

  // Log the current logo width for testing
  console.log(`Current logo width: ${logo.style.width}`);
}

// Function to lock orientation to portrait
function lockOrientation() {
  if (screen.orientation && screen.orientation.lock) {
    screen.orientation.lock("portrait").catch(function (error) {
      console.log("Orientation lock failed: ", error);
    });
  }
}

// Call the functions on page load and window resize
window.addEventListener("load", function () {
  handleLogoResponsiveness();
  lockOrientation();
});
window.addEventListener("resize", handleLogoResponsiveness);

// Reapply orientation lock if device is rotated
window.addEventListener("orientationchange", lockOrientation);

// Add this comment and the following lines to test different logo sizes
// To test different logo sizes, uncomment and modify these lines:
// document.querySelector('.logo').style.width = '50vmin'; // Test with 50% of smaller viewport dimension
// console.log('Logo size changed for testing');
