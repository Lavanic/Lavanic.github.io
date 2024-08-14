document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".nav-btn");

  buttons.forEach((button) => {
    button.addEventListener("mouseover", () => {
      button.style.animationPlayState = "paused";
    });

    button.addEventListener("mouseout", () => {
      button.style.animationPlayState = "running";
    });

    button.addEventListener("click", () => {
      // Here you can add functionality to show various content
      console.log(`${button.textContent} button clicked`);
    });
  });
});
