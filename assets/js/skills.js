// skills.js
document.addEventListener("DOMContentLoaded", function () {
  const skillBubbles = document.querySelectorAll(".skill-bubble");

  skillBubbles.forEach((bubble) => {
    const tooltip = document.createElement("div");
    tooltip.className = "skill-bubble-tooltip";
    tooltip.textContent = bubble.getAttribute("title");
    document.body.appendChild(tooltip);

    bubble.addEventListener("mouseenter", showTooltip);
    bubble.addEventListener("mouseleave", hideTooltip);
    bubble.addEventListener("touchstart", toggleTooltip, { passive: true });
  });

  function showTooltip(e) {
    const tooltip = document.querySelector(".skill-bubble-tooltip");
    const rect = this.getBoundingClientRect();
    tooltip.style.left = rect.left + rect.width / 2 + "px";
    tooltip.style.top = rect.top - 10 + "px";
    tooltip.style.opacity = "1";
    tooltip.textContent = this.getAttribute("title");
  }

  function hideTooltip() {
    const tooltip = document.querySelector(".skill-bubble-tooltip");
    tooltip.style.opacity = "0";
  }

  function toggleTooltip(e) {
    e.preventDefault();
    this.classList.toggle("active");
    if (this.classList.contains("active")) {
      showTooltip.call(this);
    } else {
      hideTooltip();
    }

    // Close other active tooltips
    skillBubbles.forEach((otherBubble) => {
      if (otherBubble !== this) {
        otherBubble.classList.remove("active");
      }
    });
  }

  // Close tooltip when clicking or touching outside
  document.addEventListener("click", closeAllTooltips);
  document.addEventListener("touchstart", closeAllTooltips, { passive: true });

  function closeAllTooltips(e) {
    if (!e.target.closest(".skill-bubble")) {
      skillBubbles.forEach((bubble) => bubble.classList.remove("active"));
      hideTooltip();
    }
  }
});
