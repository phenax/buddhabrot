const $canvas = Object.assign(document.createElement("canvas"), {
  width: 600,
  height: 600,
  style: "border: 1px solid white;",
});
document.body.appendChild($canvas);
const ctx = $canvas.getContext("2d");
const imageData = ctx.getImageData(0, 0, $canvas.width, $canvas.height);

const C = {
  new: (x, y) => ({ x, y }),
  square: (z) => C.new(z.x ** 2 - z.y ** 2, 2 * z.x * z.y),
  add: (a, b) => C.new(a.x + b.x, a.y + b.y),
};

const offset = {
  x: 80 + $canvas.width / 2,
  y: $canvas.height / 2,
};

const scale = {
  x: $canvas.width / 3,
  y: $canvas.height / 3,
};

const MAX_ITERATIONS = 20;

for (let i = 0; i < imageData.data.length; i += 4) {
  imageData.data[i] = 200;
  imageData.data[i + 1] = 50;
  imageData.data[i + 2] = 50;
  imageData.data[i + 3] = 0;

  const index = i / 4;
  const col = index % $canvas.width;
  const row = Math.floor(index / $canvas.height);

  const c = C.new((col - offset.x) / scale.x, (row - offset.y) / scale.y);

  let steps = 0;
  let z = C.new(0, 0);

  let escapes = false;
  const zList = [];
  for (steps = 0; steps < MAX_ITERATIONS; steps++) {
    z = C.add(C.square(z), c);
    zList.push(z);

    const boundary = 2;
    if (Math.abs(z.x) > boundary || Math.abs(z.y) > boundary) {
      escapes = true;
      break;
    }
  }

  if (escapes) {
    for (const z of zList) {
      const row = Math.floor(z.y * scale.y + offset.y);
      const col = Math.floor(z.x * scale.x + offset.x);

      if (row > 0 && col > 0 && row < $canvas.height && col < $canvas.width) {
        const idx = 4 * (row * $canvas.width + col);
        imageData.data[idx + 3] += 40;
      }
    }
  } else {
    // imageData.data[i] = 200;
    // imageData.data[i + 2] = 200;
  }
}

ctx.putImageData(imageData, 0, 0);
