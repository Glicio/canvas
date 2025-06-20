let scrollY = 0;

window.addEventListener("scroll", () => {
  scrollY = window.scrollY;
});

function interpolateColor(color1, color2, factor) {
  const c1 = color1.match(/\d+/g).map(Number);
  const c2 = color2.match(/\d+/g).map(Number);
  const result = c1.map((value, index) =>
    Math.round(value + factor * (c2[index] - value))
  );
  return `rgb(${result[0]}, ${result[1]}, ${result[2]})`;
}

class Blob {
  constructor(x, y, radius, points, noiseFactor) {
    this.baseX = x;
    this.baseY = y;
    this.radius = radius;
    this.points = points;
    this.noiseFactor = noiseFactor;
    this.offsets = Array.from({ length: points }, () =>
      Math.random() * Math.PI * 2
    );
    this.color1 = "rgb(255, 111, 97)";
    this.color2 = "rgb(97, 167, 255)";
  }

  tick() {
    this.offsets = this.offsets.map(offset => offset + 0.02); // Increment for animation

    this.x = this.baseX + Math.cos(scrollY / 1000) * 100; // Move horizontally with scroll
    this.y = this.baseY + Math.sin(scrollY / 1000) * 100; // Move vertically with scroll

    const factor = Math.min(scrollY / 1000, 1);
    this.color = interpolateColor(this.color1, this.color2, factor);
  }

  draw(context) {
    context.beginPath();
    const angleStep = (Math.PI * 2) / this.points;
    for (let i = 0; i < this.points; i++) {
      const angle = i * angleStep;
      const noise =
        Math.sin(this.offsets[i]) * this.noiseFactor * this.radius;
      const x = this.x + Math.cos(angle) * (this.radius + noise);
      const y = this.y + Math.sin(angle) * (this.radius + noise);

      if (i === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    }
    context.closePath();

    context.fillStyle = this.color;
    context.fill();

    context.strokeStyle = this.color;
    context.lineWidth = 3;
    context.stroke();

    // Glow effect
    context.shadowColor = this.color;
    context.shadowBlur = 20;
  }
}

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
canvas.width = window.innerWidth - 32;
canvas.height = window.innerHeight - 32;
const blobs = []

window.addEventListener("click", () => {
  const blob = new Blob(
    Math.random() * canvas.width,
    Math.random() * canvas.height,
    100,
    12,
    0.3
  );
	blobs.push(blob);
});

const blob = new Blob(canvas.width / 2, canvas.height / 2, 100, 12, 0.3);

function animate() {
  context.clearRect(0, 0, canvas.width, canvas.height);
	for(const blob of blobs) {
		blob.tick();
		blob.draw(context);
	}
  requestAnimationFrame(animate);
}

animate();
