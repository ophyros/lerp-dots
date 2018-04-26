export default class Dots {
  constructor() {
    this.time = 0;
    this.radius1 = 100;
    this.radius2 = 30;
    this.speed1 = 2;
    this.speed2 = 4;
    this.offsetX1 = .25;
    this.offsetX2 = .75;
    this.offsetY = .5;
    this.count = 600;
    this.delay = 2;
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.createCanvas();
    this.update();

    window.addEventListener('resize', () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    });
  }

  lerp(a, b, t) {
    return (1 - t) * a + t * b;
  }

  drawCircle(x, y, r) {
    this.ctx.fillStyle = '#fff';
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.closePath();
  }

  calculateX(offset, radius, speed, t) {
    return offset * this.width + radius * Math.cos(speed * Math.PI * t);
  }

  calculateY(offset, radius, speed, t) {
    return offset * this.height + radius * Math.sin(speed * Math.PI * t);
  }

  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    document.body.appendChild(this.canvas);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    let x1 = this.calculateX(this.offsetX1, this.radius1, this.speed1, this.time);
    let x2 = this.calculateX(this.offsetX2, this.radius2, this.speed2, this.time);
    let y1 = this.calculateY(this.offsetY, this.radius1, this.speed1, this.time);
    let y2 = this.calculateY(this.offsetY, this.radius2, this.speed2, this.time);
    this.drawCircle(x1, y1, 6);
    this.drawCircle(x2, y2, 6);

    for (let i = 0; i < this.count; i++) {
      let tt = 1 * i / this.count;
      let xx = this.lerp(
                          this.calculateX(this.offsetX1, this.radius1, this.speed1, this.time - this.delay * tt),
                          this.calculateX(this.offsetX2, this.radius2, this.speed2, this.time - this.delay * (1 -tt)),
                          tt);
      let yy = this.lerp(
                          this.calculateY(this.offsetY, this.radius1, this.speed1, this.time - this.delay * tt),
                          this.calculateY(this.offsetY, this.radius2, this.speed2, this.time - this.delay * (1 - tt)),
                          tt);
      this.drawCircle(xx, yy, 2);
    }
  }

  update() {
    this.time += .01;
    this.draw();
    requestAnimationFrame(() => this.update());
  }
}
