document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("starCanvas");
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();

  const entities = [];
  const entityCount = 100;
  const entityColors = ["#FFFFFF", "#E48DED", "#87CEEB"];

  class Entity {
    constructor() {
      this.size = Math.random() * 10 + 7; // Size range between 4 and 10 pixels
      this.x = Math.random() * canvas.width; // Random initial x position
      this.y = Math.random() * canvas.height; // Random initial y position
      this.angle = Math.atan2(
        this.y - canvas.height / 2,
        this.x - canvas.width / 2
      );
      const speed = Math.random() * 0.1 + 0.1; // Slower speed range between 0.1 and 0.4
      this.dx = Math.cos(this.angle) * speed;
      this.dy = Math.sin(this.angle) * speed;
      this.color =
        entityColors[Math.floor(Math.random() * entityColors.length)];
      this.opacity = Math.random() * 0.8 + 0.2;
      this.fadeInRate = 0.005; // Adjust this value to control fade-in speed
    }

    update() {
      this.x += this.dx;
      this.y += this.dy;

      // Ensure opacity reaches maximum
      if (this.opacity < this.maxOpacity) {
        this.opacity += this.fadeInRate;
      }

      if (this.isOutOfView()) {
        this.reset();
      }
    }

    isOutOfView() {
      return (
        this.x + this.size < 0 ||
        this.x - this.size > canvas.width ||
        this.y + this.size < 0 ||
        this.y - this.size > canvas.height
      );
    }

    reset() {
      this.size = Math.random() * 6 + 4; // Size range between 4 and 10 pixels
      this.x = Math.random() * canvas.width; // Respawn at a random position
      this.y = Math.random() * canvas.height; // Respawn at a random position
      this.angle = Math.atan2(
        this.y - canvas.height / 2,
        this.x - canvas.width / 2
      );
      const speed = Math.random() * 0.3 + 0.1; // Slower speed range between 0.1 and 0.4
      this.dx = Math.cos(this.angle) * speed;
      this.dy = Math.sin(this.angle) * speed;
      this.opacity = 0;
      this.maxOpacity = Math.random() * 0.8 + 0.2;
    }

    draw() {
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.beginPath();

      if (this.isSquare) {
        ctx.rect(
          this.x - this.size / 2,
          this.y - this.size / 2,
          this.size,
          this.size
        );
      } else {
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
      }

      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1.0;
    }
  }

  // Create initial entities
  for (let i = 0; i < entityCount; i++) {
    entities.push(new Entity());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    entities.forEach((entity) => {
      entity.update();
      entity.draw();
    });
    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener("resize", resizeCanvas);
});
