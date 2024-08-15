document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".nav-btn");
  const contentContainer = document.getElementById("content-container");

  async function loadContent(page) {
    try {
      console.log(`Attempting to load ${page}`);
      const response = await fetch(`./assets/pages/${page}.html`);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const content = await response.text();
      contentContainer.innerHTML = content;
      const section = contentContainer.querySelector(".content-section");
      if (section) {
        section.classList.add("active");
      }
      contentContainer.style.opacity = 1;

      // Start typing animation
      if (window.startTypingAnimation) {
        window.startTypingAnimation();
      }
    } catch (e) {
      console.error("Error loading content:", e);
      contentContainer.innerHTML =
        "<p>Error loading content. Please try again later.</p>";
    }
  }

  function toggleContent(targetId) {
    console.log(`Toggling content for ${targetId}`);
    if (contentContainer.dataset.currentPage === targetId) {
      contentContainer.style.opacity = 0;
      contentContainer.dataset.currentPage = "";
      setTimeout(() => {
        contentContainer.innerHTML = "";
      }, 300);
    } else {
      loadContent(targetId);
      contentContainer.dataset.currentPage = targetId;
    }
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-target");
      console.log(`Button clicked: ${targetId}`);
      buttons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      toggleContent(targetId);
    });
  });

  // Load About page by default
  console.log("Loading default 'about' page");
  loadContent("about");
});
