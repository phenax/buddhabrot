const $canvas = Object.assign(document.createElement("canvas"), {
  width: 600,
  height: 600,
  style: "border: 1px solid white;",
});

document.body.appendChild($canvas);

const ctx = $canvas.getContext("2d");

// Mandelbrot
//  -- Read all pixels on canvas
//  -- For each pixel,
//    -- apply zn = z^2 + c
//    -- if zn tends to infinity, ignore it
//    -- else plot it

const imageData = ctx.getImageData(0, 0, $canvas.width, $canvas.height);

const C = {
  new: (x, y) => ({ x, y }),
  square: (z) => C.new(z.x ** 2 + z.y ** 2, 2 * z.x * z.y),
  add: (a, b) => C.new(a.x + b.x, a.y + b.y),
};

const offset = {
  x: $canvas.width / 2,
  y: $canvas.height / 2,
};

const scale = {
  x: $canvas.width / 4,
  y: $canvas.height / 4,
};

for (let i = 0; i < imageData.data.length; i += 4) {
  imageData.data[i] = 255;
  imageData.data[i + 1] = 0;
  imageData.data[i + 2] = 0;
  imageData.data[i + 3] = 255;

  const index = i / 4;
  const col = index % $canvas.width;
  const row = Math.floor(index / $canvas.height);

  const c = C.new(col / scale.x - offset.x, row / scale.y - offset.y);

  let z = C.new(0, 0);

  let steps = 0;
  for (steps = 0; steps < 20; steps++) {
    z = C.add(C.square(z), c); // z^2 + c

    const boundary = 1;
    if (z.x > boundary || z.y > boundary) {
      break;
    }
  }

  if (steps > 10) {
    imageData.data[i] = 0;
    imageData.data[i + 2] = 255;
  }
}

ctx.putImageData(imageData, 0, 0);
