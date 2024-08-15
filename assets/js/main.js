document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".nav-btn");
  const contentContainer = document.getElementById("content-container");
  const contentSections = document.querySelectorAll(".content-section");
  let isInitialLoad = true;

  function toggleContent(targetId) {
    const targetSection = document.getElementById(targetId);

    if (targetSection.classList.contains("active") && !isInitialLoad) {
      // If clicking the same button, hide the content
      contentContainer.classList.add("hidden");
      setTimeout(() => {
        contentContainer.style.display = "none";
        targetSection.classList.remove("active");
      }, 300); // Match this duration with the CSS transition
    } else {
      // Show the content and activate the correct section
      contentContainer.style.display = "block";
      setTimeout(() => {
        contentContainer.classList.remove("hidden");
      }, 0);

      contentSections.forEach((section) => {
        section.classList.remove("active");
      });
      targetSection.classList.add("active");
    }

    isInitialLoad = false;
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-target");
      buttons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      toggleContent(targetId);
    });
  });

  // Show About section by default
  toggleContent("about");
});
