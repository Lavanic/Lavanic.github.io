document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".nav-btn");
  const contentContainer = document.getElementById("content-container");
  const contentSections = document.querySelectorAll(".content-section");

  function toggleContent(targetId) {
    const targetSection = document.getElementById(targetId);

    if (targetSection.classList.contains("active")) {
      // If clicking the same button, hide the content
      contentContainer.style.display = "none";
      targetSection.classList.remove("active");
    } else {
      // Show the content and activate the correct section
      contentContainer.style.display = "block";
      contentSections.forEach((section) => {
        section.classList.remove("active");
      });
      targetSection.classList.add("active");
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

  // Show About section by default
  toggleContent("about");
});
