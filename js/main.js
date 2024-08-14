document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("starCanvas");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const stars = [];
  const starCount = 20;
  const starColors = ["#FFFFFF", "#E48DED", "#87CEEB"];

  class Star {
    constructor() {
      this.size = 30;
      this.x = Math.random() * (canvas.width - this.size);
      this.y = Math.random() * (canvas.height - this.size);
      this.dx = (Math.random() - 0.5) * 4;
      this.dy = (Math.random() - 0.5) * 4;
      this.color = starColors[Math.floor(Math.random() * starColors.length)];
    }

    update() {
      if (this.x + this.size > canvas.width || this.x < 0) this.dx = -this.dx;
      if (this.y + this.size > canvas.height || this.y < 0) this.dy = -this.dy;
      this.x += this.dx;
      this.y += this.dy;
    }

    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const x = this.x + (this.size / 2) * Math.cos(angle);
        const y = this.y + (this.size / 2) * Math.sin(angle);
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.fill();
    }
  }

  for (let i = 0; i < starCount; i++) {
    stars.push(new Star());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach((star) => {
      star.update();
      star.draw();
    });
    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
});
