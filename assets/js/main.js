// main.js

function handleResponsiveness() {
  const logo = document.querySelector(".logo");
  const mainContainer = document.querySelector(".main-container");
  const topBar = document.querySelector(".top-bar");
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Nav Icons
  const navIcons = document.querySelectorAll(".nav-icon");
  const iconHeight = viewportWidth < 768 ? "2vh" : "2.8vh";
  navIcons.forEach((icon) => {
    icon.style.height = iconHeight;
  });

  // Logo responsiveness
  const smallerDimension = Math.min(viewportWidth, viewportHeight);
  if (smallerDimension < 768) {
    logo.style.width = "65vmin";
  } else {
    logo.style.width = "73.33vmin";
  }

  // Main container responsiveness
  if (viewportWidth < 768) {
    mainContainer.style.height = "65vh";
    topBar.style.height = "58px";
  } else {
    mainContainer.style.height = "80vh";
    topBar.style.height = "52px";
  }

  // Adjust screw size based on screen width
  const screws = document.querySelectorAll(".screw");
  const screwSize = viewportWidth < 768 ? "20px" : "25px"; // Adjust these values as needed
  screws.forEach((screw) => {
    screw.style.width = screwSize;
    screw.style.height = screwSize;
  });
}

// Modify the initTabSwitching function
function initTabSwitching() {
  const navButtons = document.querySelectorAll(".nav-button");
  const contentArea = document.querySelector(".content-area");
  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const page = button.getAttribute("data-page");
      loadPage(page, contentArea);
    });
  });
  // Load default page (Home)
  loadPage("home", contentArea);
}

// Add this function to handle active state
function setActiveTab(page) {
  const navButtons = document.querySelectorAll(".nav-button");
  navButtons.forEach((button) => {
    if (button.getAttribute("data-page") === page) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });
}

const text = `Hey there, I'm <span class="blue-text">Oliver Ohrt</span>, a sophomore at <span class="red-text">UW-Madison</span> pursuing a Bachelor of Science in <span class="blue-text">Computer Science</span>. With a passion for coding and a strong foundation in languages like <span class="yellow-text">Java</span>, <span class="yellow-text">Python</span>, and <span class="yellow-text">Rust</span>, I've led multiple projects that showcase my problem-solving skills and leadership abilities. I've won three hackathons, most recently for developing Badger+, an application tailored for <span class="red-text">UW Madison<span> students. My experience ranges from crafting innovative web applications to guiding students as a <span class="blue-text">Robotics Instructor</span> at <span class="green-text">iD Tech</span> Camps. I'm looking to bring my technical expertise and collaborative spirit to a dynamic internship where I can continue to grow and make an impact.`;

let i = 0;
function typeWriter() {
  const typedTextElement = document.getElementById("typed-text");
  if (typedTextElement && i < text.length) {
    if (text.charAt(i) === "<") {
      const closingIndex = text.indexOf(">", i);
      const spanElement = document.createElement("span");
      spanElement.className = text.substring(i + 1, closingIndex).split('"')[1];
      typedTextElement.appendChild(spanElement);
      i = closingIndex + 1;
    } else if (
      typedTextElement.lastElementChild &&
      typedTextElement.lastElementChild.tagName === "SPAN"
    ) {
      typedTextElement.lastElementChild.textContent += text.charAt(i);
      i++;
    } else {
      const textNode = document.createTextNode(text.charAt(i));
      typedTextElement.appendChild(textNode);
      i++;
    }
    // Scroll to the bottom of the container
    typedTextElement.parentElement.scrollTop =
      typedTextElement.parentElement.scrollHeight;
    setTimeout(typeWriter, 20);
  }
}

function loadPage(page, contentArea) {
  fetch(`assets/pages/${page}.html`)
    .then((response) => response.text())
    .then((html) => {
      contentArea.innerHTML = html;
      loadPageStyles(page);
      setActiveTab(page);
      if (page === "home") {
        i = 0; // Reset the counter
        const typedTextElement = document.getElementById("typed-text");
        if (typedTextElement) {
          typedTextElement.innerHTML = ""; // Clear existing text
          setTimeout(typeWriter, 100); // Start typing effect after a short delay
        }
      }
    })
    .catch((error) => {
      console.error("Error loading page:", error);
      contentArea.innerHTML = "<p>Error loading content.</p>";
    });
}

function loadPageStyles(page) {
  const head = document.head;
  const link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = `assets/css/${page}.css`;
  head.appendChild(link);
}

window.addEventListener("load", function () {
  handleResponsiveness();
  lockOrientation();
  initTabSwitching();
});

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
