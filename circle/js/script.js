const canvas = document.getElementById("canvas");
const cp = (4 / 3) * (Math.sqrt(2) - 1);
canvas.width = window.innerWidth - 32;
canvas.height = window.innerHeight - 32;


x = 1920;

class Vec2 {
  constructor(x, y, width, height) {
    this._screenX = x;
    this._screenY = y;
    this._width = width;
    this._height = height;
  }

  // Getter for x in Cartesian coordinates
  get x() {
    return 2 * (this._screenX / this._width) - 1;
  }

  // Setter for screen x, updates internal screen coordinate
  set x(screenX) {
    this._screenX = screenX;
  }

  // Getter for y in Cartesian coordinates
  get y() {
    return 1 - 2 * (this._screenY / this._height);
  }

  // Setter for screen y, updates internal screen coordinate
  set y(screenY) {
    this._screenY = screenY;
  }

  // Optional: Access to raw screen coordinates
  get screenX() {
    return this._screenX;
  }

  set screenX(x) {
    this._screenX = x;
  }

  get screenY() {
    return this._screenY;
  }

  set screenY(y) {
    this._screenY = y;
  }
}

const getRandomColor = () => {
  const chars = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += chars[Math.floor(Math.random() * 16)];
  }
  return color;
};

class Circle {
  radius;
  scaleX = 1;
  scaleY = 1;
  direction = 1;
  maxScale = 1;
  shadowScale = 1;
  constructor(
    x,
    y,
    radius,
    orientation = 0,
    randomShadow = true,
    updateShadow = false,
  ) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.orientation = orientation;
    this.color = getRandomColor();
    this.shadowColor = randomShadow ? getRandomColor() : this.color;
    this.updateShadow = updateShadow;
  }

  getEllipse() {
    return {
      x: this.x,
      y: this.y,
      radiusX: this.radius * this.scaleX,
      radiusY: this.radius * this.scaleY,
    };
  }

  tick() {
    if (this.updateShadow) {
      if (this.shadowScale > 100) {
        this.shadowScale = 0;
      } else {
        this.shadowScale += 0.1;
      }
    }
    if (this.orientation === 0) {
      if (this.direction === 1) {
        this.scaleX += 0.01;
      } else {
        const value = this.scaleX - 0.01;
        this.scaleX = value > 0 ? value : 0;
      }

      if (this.scaleX > this.maxScale || this.scaleX <= 0.001) {
        this.direction = this.direction === 1 ? 0 : 1;
      }
    } else {
      if (this.direction === 1) {
        this.scaleY += 0.01;
      } else {
        const value = this.scaleY - 0.01;
        this.scaleY = value > 0 ? value : 0;
      }

      if (this.scaleY > this.maxScale || this.scaleY <= 0.001) {
        this.direction = this.direction === 1 ? 0 : 1;
      }
    }
  }
}

const circles = [];
let ori = 0;

window.addEventListener("click", (e) => {
  const x = e.clientX;
  const y = e.clientY;
  const circle = new Circle(x, y, 100, ori, true, true);
  circles.push(circle);
  ori = ori === 0 ? 1 : 0;
});

(() => {
  let ori = 0;
  for (let i = 0; i < 20; i++) {
    const x = canvas.width / 2;
    const y = canvas.height / 2;
    const radius = Math.random() * 300;
    const circle = new Circle(x, y, radius, ori);
    setTimeout(() => {
      circles.push(circle);
    }, 1000 * i);
    ori = ori === 0 ? 1 : 0;
  }
})();

class Canvas {
  context;
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
  }

  draw() {
    // Clear the canvas
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.shadowBlur = 0;
    this.context.shadowColor = "transparent";

    // Draw the circles
    for (const circle of circles) {
      circle.tick();
      const ellipse = circle.getEllipse();
      this.context.beginPath();
      this.context.ellipse(
        ellipse.x,
        ellipse.y,
        ellipse.radiusX,
        ellipse.radiusY,
        0,
        0,
        Math.PI * 2,
      );
      this.context.shadowBlur = 10 * circle.shadowScale;
      this.context.shadowColor = circle.shadowColor;
      this.context.strokeStyle = circle.color;
      this.context.strokeWidth = 2;
      this.context.stroke();
    }
    requestAnimationFrame(this.draw.bind(this));
  }
}

const canvasClass = new Canvas(document.getElementById("canvas"));

canvasClass.draw();
