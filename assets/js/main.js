// main.js

// Function to handle the responsive behavior of the logo
function handleLogoResponsiveness() {
  const logo = document.querySelector(".logo");
  const viewportWidth = window.innerWidth;

  // Adjust logo size based on viewport width
  if (viewportWidth < 768) {
    logo.style.width = "70vw"; // 70% of viewport width for mobile
  } else {
    logo.style.width = "33.33vw"; // Approximately 1/3 of viewport width for desktop
  }

  // Log the current logo width for testing
  console.log(`Current logo width: ${logo.style.width}`);
}

// Call the function on page load and window resize
window.addEventListener("load", handleLogoResponsiveness);
window.addEventListener("resize", handleLogoResponsiveness);

// Add this comment and the following lines to test different logo sizes
// To test different logo sizes, uncomment and modify these lines:
// document.querySelector('.logo').style.width = '50vw'; // Test with 50% viewport width
// console.log('Logo size changed for testing');
