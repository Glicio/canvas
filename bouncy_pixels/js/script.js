const PARTICLE_LIMIT = 1000;

const gravityInput = document.getElementById("gravity");
gravityInput.addEventListener("change", (e) => {
	const parsed = Number.parseFloat(e.target.value) ?? 0.1;
	gravity.y = parsed;
});


const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth - 24;
canvas.height = window.innerHeight;

class Vector2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(vector) {
    this.x += vector.x;
    this.y += vector.y;
  }
}

const gravity = new Vector2(0, 0.1);

// simple pixel class
class Cell {
  color = "#fff";
  position = new Vector2(0, 0);
  velocity = new Vector2(0, 0);
  constructor(x, y, color = "#fff") {
    this.position.x = x;
    this.position.y = y;
    this.color = color;
  }

  get x() {
    return this.position.x;
  }

  set x(value) {
    this.position.x = value;
  }

  get y() {
    return this.position.y;
  }

  set y(value) {
    this.position.y = value;
  }

  add(vector) {
    this.position.add(vector);
  }

  reverse() {
    let reversed = this.velocity.y * -1;
    reversed = reversed * 0.8; // slow down
    const jumpVelocity = new Vector2(0, reversed * 2);
    this.velocity.add(jumpVelocity);
  }

  tick() {
    if (this.y >= canvas.height - 100 && this.velocity.y >= 0) {
      this.reverse();
    }

    if (this.y < canvas.height - 100) {
      this.velocity.add(gravity);
    }
    this.y += this.velocity.y;
    this.x += this.velocity.x;
  }
}

const cells = [];



const getRandomColor = () => {
  const chars = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += chars[Math.floor(Math.random() * 16)];
  }
  return color;
};

const addCell = (x, y, color) => {
  let intColor = color;
  if (cells.length > PARTICLE_LIMIT) {
    cells.shift();
  }

  if (!intColor) {
    intColor = getRandomColor();
  }

  cells.push(new Cell(x, y, intColor));
};


window.addEventListener("click", (e) => {
	if(e.target.tagName !== "CANVAS") {
		return;
	}
  addCell(e.clientX, e.clientY);
});

class Canvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.width = canvas.width;
    this.height = canvas.height;
    this.color = "#fff";
    this.lineWidth = 1;
    this.lineCap = "round";
    this.lineJoin = "round";
    this.fillStyle = "#fff";
    this.font = "20px Arial";
    this.textAlign = "center";
    this.textBaseline = "middle";
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    //draw cells
    for (const cell of cells) {
      this.ctx.fillStyle = cell.color;
      cell.tick();
      this.ctx.fillRect(cell.x, cell.y, 10, 10);
    }

    requestAnimationFrame(this.draw.bind(this));
  }

  setColor(color) {
    this.color = color;
  }

  setLineWidth(width) {
    this.lineWidth = width;
  }

  setLineCap(cap) {
    this.lineCap = cap;
  }

  setLineJoin(join) {
    this.lineJoin = join;
  }

  setFillStyle(style) {
    this.fillStyle = style;
  }

  setFont(font) {
    this.font = font;
  }

  setTextAlign(align) {
    this.textAlign = align;
  }

  setTextBaseline(baseline) {
    this.textBaseline = baseline;
  }

  fillRect(x, y, width, height) {
    this.ctx.fillRect(x, y, width, height);
  }

  strokeRect(x, y, width, height) {
    this.ctx.strokeRect(x, y, width, height);
  }

  fillText(text, x, y) {
    this.ctx.fillText(text, x, y);
  }

  strokeText(text, x, y) {
    this.ctx.strokeText(text, x, y);
  }
}

const canvasInstance = new Canvas(canvas);

canvasInstance.draw();
