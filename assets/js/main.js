/* Oliver Ohrt 2024 */
let hasTypedOnce = false;
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
    topBar.style.height = "38px";
    topBar.style.minHeight = "38px";
  } else {
    mainContainer.style.height = "80vh";
    topBar.style.height = "52px";
    topBar.style.minHeight = "52px";
  }

  const screws = document.querySelectorAll(".screw");
  const screwSize = viewportWidth < 768 ? "20px" : "25px";
  screws.forEach((screw) => {
    screw.style.width = screwSize;
    screw.style.height = screwSize;
  });
}

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

const text = `Hey there, I'm <span class="blue-text">Oliver Ohrt</span>, a junior at <span class="red-text">UW-Madison</span> pursuing a Bachelor of Science in <span class="blue-text">Computer Science</span>. With a passion for coding and a strong foundation in languages like <span class="yellow-text">C++</span>, <span class="yellow-text">Python</span>, and <span class="yellow-text">Java</span>, I've led multiple projects that showcase my problem-solving skills and leadership abilities. I've won six hackathons, most recently winning <span class="orange-text">Amazon</span>'s AGI-DS org-wide hackathon by implementing a dynamic taxonomy system for skill representations to improve task routing. Last summer, I interned at <span class="orange-text">Amazon</span> on the AGI team, building and deploying a production-grade internal portal used to support 850+ AI/ML contractors. On campus, I serve as a <span class="red-text">UPL Coordinator</span> and helped organize <span class="blue-text">MadHacks</span>, Wisconsin's largest hackathon with 419 participants and 114 projects. My experience ranges from crafting innovative web applications to guiding students as a <span class="blue-text">Robotics Instructor</span> at <span class="green-text">iD Tech</span> Camps. I'm looking to bring my technical expertise and collaborative spirit to a dynamic internship where I can continue to grow and make an impact.`;

let i = 0;
const breakPoint = "problem-solving skills ";
let hasReachedBreakPoint = false;

function typeWriter() {
  const typedTextElement = document.getElementById("typed-text");
  const expandedTextElement = document.getElementById("expanded-text");
  const isMobile = window.innerWidth <= 768;

  if (typedTextElement && i < text.length) {
    let currentElement =
      isMobile && hasReachedBreakPoint ? expandedTextElement : typedTextElement;

    if (text.charAt(i) === "<") {
      const closingIndex = text.indexOf(">", i);
      const spanElement = document.createElement("span");
      spanElement.className = text.substring(i + 1, closingIndex).split('"')[1];
      currentElement.appendChild(spanElement);
      i = closingIndex + 1;
    } else if (
      currentElement.lastElementChild &&
      currentElement.lastElementChild.tagName === "SPAN"
    ) {
      currentElement.lastElementChild.textContent += text.charAt(i);
      i++;
    } else {
      const textNode = document.createTextNode(text.charAt(i));
      currentElement.appendChild(textNode);
      i++;
    }
    if (
      !hasReachedBreakPoint &&
      typedTextElement.textContent.includes(breakPoint)
    ) {
      hasReachedBreakPoint = true;
      if (isMobile) {
        expandedTextElement.style.display = "block";
      }
    }

    setTimeout(typeWriter, 7);
  } else {
    // Typing is complete
    hasTypedOnce = true;
    const cursor = document.getElementById("cursor");
    if (cursor) {
      cursor.style.display = "none";
    }
  }
}

//Reset the typing effect
function resetTypingEffect() {
  hasTypedOnce = false;
}

function loadPage(page, contentArea) {
  fetch(`assets/pages/${page}.html`)
    .then((response) => response.text())
    .then((html) => {
      contentArea.innerHTML = html;
      loadPageStyles(page);
      setActiveTab(page);
      if (page === "projects" && window.initializeProjects) {
        window.initializeProjects();
      }
      if (page === "home") {
        const typedTextElement = document.getElementById("typed-text");
        const expandedTextElement = document.getElementById("expanded-text");
        const cursor = document.getElementById("cursor");
        const isMobile = window.innerWidth <= 768;

        if (typedTextElement && expandedTextElement) {
          if (!hasTypedOnce) {
            i = 0;
            hasReachedBreakPoint = false;
            typedTextElement.innerHTML = "";
            expandedTextElement.innerHTML = "";
            if (cursor) cursor.style.display = "inline-block";
            setTimeout(typeWriter, 100);
          } else {
            if (isMobile) {
              const [firstPart, secondPart] = text.split(breakPoint);
              typedTextElement.innerHTML = firstPart + breakPoint;
              expandedTextElement.innerHTML = secondPart;
              expandedTextElement.style.display = "block";
            } else {
              typedTextElement.innerHTML = text;
              expandedTextElement.style.display = "none";
            }
            if (cursor) cursor.style.display = "none";
          }
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

function initScrewSpin() {
  const screws = document.querySelectorAll(".screw");
  screws.forEach((screw) => {
    let rotation = 0;
    screw.addEventListener("click", function () {
      rotation += 360;
      this.style.setProperty("--rotation", `${rotation}deg`);
    });
  });
}

window.addEventListener("load", function () {
  handleResponsiveness();
  initTabSwitching();
  initScrewSpin();
  hasTypedOnce = false; // Reset the typing effect on page load
});

window.addEventListener("resize", handleResponsiveness);
