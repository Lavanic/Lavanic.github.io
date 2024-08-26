function initializeProjects() {
  const projectItems = document.querySelectorAll(".project-item");
  const projectDetails = document.getElementById("projectDetails");
  const closeButton = document.querySelector(".close-button");
  const projectContainer = document.querySelector(".project-container");
  const projectTitle = document.querySelector(".project-title");

  if (
    !projectItems.length ||
    !projectDetails ||
    !closeButton ||
    !projectContainer
  ) {
    console.log("Projects page elements not found. Skipping initialization.");
    return;
  }

  projectItems.forEach((item) => {
    item.addEventListener("click", function () {
      const projectName = this.getAttribute("data-project");
      loadProjectContent(projectName);
      projectDetails.style.display = "flex";
    });
  });

  closeButton.addEventListener("click", function () {
    projectDetails.style.display = "none";
  });

  function loadProjectContent(projectName) {
    fetch(`assets/project-details/${projectName}.html`)
      .then((response) => response.text())
      .then((data) => {
        projectContainer.innerHTML = data;
        projectTitle.textContent = getProjectTitle(projectName);
      })
      .catch((error) => {
        console.error("Error loading project details:", error);
        projectContainer.innerHTML =
          "<p>Error loading project details. Please try again.</p>";
      });
  }
  function getProjectTitle(projectName) {
    switch (projectName) {
      case "foodshares":
        return "FoodShares - HackPNW Winner";
      case "badgerplus":
        return "Badger+ - Campus App";
      // Add cases for other projects
      default:
        return projectName.charAt(0).toUpperCase() + projectName.slice(1);
    }
  }
}

function checkAndInitializeProjects() {
  if (document.querySelector(".projects-content")) {
    initializeProjects();
  } else {
    console.log("Projects page not loaded yet. Waiting...");
    setTimeout(checkAndInitializeProjects, 100);
  }
}

document.addEventListener("DOMContentLoaded", checkAndInitializeProjects);
