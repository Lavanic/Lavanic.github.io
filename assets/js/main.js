document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".nav-btn");
  const contentContainer = document.getElementById("content-container");

  async function loadContent(page) {
    try {
      const response = await fetch(`./assets/pages/${page}.html`);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const content = await response.text();
      contentContainer.innerHTML = content;
      contentContainer.style.opacity = 1;
    } catch (e) {
      console.error("Error loading content:", e);
      contentContainer.innerHTML =
        "<p>Error loading content. Please try again later.</p>";
    }
  }

  function toggleContent(targetId) {
    if (contentContainer.dataset.currentPage === targetId) {
      contentContainer.style.opacity = 0;
      contentContainer.dataset.currentPage = "";
    } else {
      loadContent(targetId);
      contentContainer.dataset.currentPage = targetId;
    }
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-target");
      buttons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      toggleContent(targetId);
    });
  });

  // Load About page by default
  loadContent("about");
});
