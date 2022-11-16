const $canvas = Object.assign(document.createElement("canvas"), {
  width: 1200,
  height: 675,
});
document.body.appendChild($canvas);
const ctx = $canvas.getContext("2d");

const C = {
  new: (x, y) => ({ x, y }),
  square: (z) => C.new(z.x ** 2 - z.y ** 2, 2 * z.x * z.y),
  add: (a, b) => C.new(a.x + b.x, a.y + b.y),
};

const offset = {
  x: 80 + $canvas.width / 2,
  y: $canvas.height / 2,
};

const scale = Math.min($canvas.width, $canvas.height) / 2;

const MAX_ITERATIONS = 10000;

const alphaChannelMap = new Map();
const getAlpha = (x, y) => alphaChannelMap.get(`${x}--${y}`) ?? 0;
const setAlpha = (x, y, a) => alphaChannelMap.set(`${x}--${y}`, a);

const nextFrame = () => new Promise((res) => requestAnimationFrame(res));

const run = async () => {
  let pointsDrawn = 0;

  const [cols, rows] = [$canvas.width, $canvas.height];

  for (let row = -100; row < rows; row++) {
    for (let col = -100; col < cols; col++) {
      const c = C.new((col - offset.x) / scale, (row - offset.y) / scale);

      let steps = 0;
      let z = C.new(0, 0);

      let escapes = false;
      const zList = [];
      for (steps = 0; steps < MAX_ITERATIONS; steps++) {
        z = C.add(C.square(z), c);
        zList.push(z);

        if (Math.abs(z.x) > 2 || Math.abs(z.y) > 2) {
          escapes = true;
          break;
        }
      }

      if (escapes) {
        for (const [i, z] of zList.entries()) {
          const y = Math.floor(z.y * scale + offset.y);
          const x = Math.floor(z.x * scale + offset.x);

          if (y > 0 && x > 0 && y < $canvas.height && x < $canvas.width) {
            const alpha = Math.min(1, getAlpha(x, y) * 0.2 + 0.1);
            const [r, g, b] =
              i > MAX_ITERATIONS / 8 ? [200, 10, 10]
              : i > MAX_ITERATIONS / 16 ? [200, 200, 10]
              : i > MAX_ITERATIONS / 20 ? [200, 10, 100]
              : [10, 10, 200];
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            ctx.fillRect(x, y, 1, 1);
            setAlpha(y, x, alpha);
          }
        }
      }

      pointsDrawn++;
      if (pointsDrawn % 1000 === 0) {
        await nextFrame();
      }
    }
  }
};

run();
