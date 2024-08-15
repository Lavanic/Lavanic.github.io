function typeWriter(element, text, speed, callback) {
  let i = 0;
  element.textContent = ""; // Clear the element before typing
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    } else if (callback) {
      callback();
    }
  }
  type();
}

function startTypingAnimation() {
  const contentSection = document.querySelector(".content-section");
  if (!contentSection) return;

  const elements = contentSection.querySelectorAll("h2, h3, p");
  let currentIndex = 0;

  // Hide all elements initially
  elements.forEach((el) => (el.style.visibility = "hidden"));

  function typeNextElement() {
    if (currentIndex < elements.length) {
      const element = elements[currentIndex];
      element.style.visibility = "visible";
      const originalText = element.textContent;
      typeWriter(element, originalText, 10, () => {
        currentIndex++;
        typeNextElement();
      });
    } else {
      // Add cursor at the end of the last element
      const lastElement = elements[elements.length - 1];
      lastElement.innerHTML += '<span class="typed-cursor">_</span>';
    }
  }

  // Start typing after a short delay to ensure elements are hidden
  setTimeout(typeNextElement, 100);
}

window.startTypingAnimation = startTypingAnimation;
