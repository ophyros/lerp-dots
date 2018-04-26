import dat from 'dat.gui';

let x1, x2, y1, y2, xx, yy, rr, tt;
let width = window.innerWidth;
let height = window.innerHeight;
let time = 0;

let cfg = {
  radius1: 100,
  radius2: 30,
  speed1: 2,
  speed2: 4,
  offsetX1: .25,
  offsetX2: .75,
  offsetY1: .5,
  offsetY2: .5,
  dotRadius1: 6,
  dotRadius2: 2,
  lineDotsCount: 600,
  delay: 2,
};


function lerp(a, b, t) {
  return (1 - t) * a + t * b;
}

function drawCircle(x, y, r) {
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fill();
  ctx.closePath();
}

function calculateX(offset, radius, speed, t) {
  return offset * width + radius * Math.cos(speed * Math.PI * t);
}

function calculateY(offset, radius, speed, t) {
  return offset * height + radius * Math.sin(speed * Math.PI * t);
}

function draw() {
  ctx.clearRect(0, 0, width, height);
  x1 = calculateX(cfg.offsetX1, cfg.radius1, cfg.speed1, time);
  x2 = calculateX(cfg.offsetX2, cfg.radius2, cfg.speed2, time);
  y1 = calculateY(cfg.offsetY1, cfg.radius1, cfg.speed1, time);
  y2 = calculateY(cfg.offsetY2, cfg.radius2, cfg.speed2, time);
  drawCircle(x1, y1, cfg.dotRadius1);
  drawCircle(x2, y2, cfg.dotRadius2);

  for (let i = 0; i < cfg.lineDotsCount; i++) {
    tt = i / cfg.lineDotsCount;
    xx = lerp(
              calculateX(cfg.offsetX1, cfg.radius1, cfg.speed1, time - cfg.delay * tt),
              calculateX(cfg.offsetX2, cfg.radius2, cfg.speed2, time - cfg.delay * (1 -tt)),
              tt);
    yy = lerp(
              calculateY(cfg.offsetY1, cfg.radius1, cfg.speed1, time - cfg.delay * tt),
              calculateY(cfg.offsetY2, cfg.radius2, cfg.speed2, time - cfg.delay * (1 - tt)),
              tt);
    rr = lerp(cfg.dotRadius1, cfg.dotRadius2, tt);
    drawCircle(xx, yy, rr);
  }
}

function update() {
  time += .01;
  draw();
  requestAnimationFrame(update);
}

let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');
canvas.width = width;
canvas.height = height;
document.body.appendChild(canvas);

window.addEventListener('resize', () => {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
});

let gui = new dat.GUI();
gui.add(cfg, 'radius1', 0, 100, 1);
gui.add(cfg, 'radius2', 0, 100, 1);
gui.add(cfg, 'speed1', 1, 10, 1);
gui.add(cfg, 'speed2', 1, 10, 1);
gui.add(cfg, 'offsetX1', 0, 1, .01);
gui.add(cfg, 'offsetY1', 0, 1, .01);
gui.add(cfg, 'offsetX2', 0, 1, .01);
gui.add(cfg, 'offsetY2', 0, 1, .01);
gui.add(cfg, 'dotRadius1', 1, 20, 1);
gui.add(cfg, 'dotRadius2', 1, 20, 1);
gui.add(cfg, 'delay', 1, 20, 1);
gui.add(cfg, 'lineDotsCount', 10, 1000, 10);

update();
