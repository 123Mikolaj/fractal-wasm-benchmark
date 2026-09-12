export function juliaPoint(
  real,
  imaginary,
  cReal,
  cImaginary,
  maxIterations
) {
  let zReal = real;
  let zImaginary = imaginary;
  let iteration = 0;

  while (iteration < maxIterations) {
    const newReal =
      zReal * zReal - zImaginary * zImaginary + cReal;

      const newImaginary =
        2 * zReal * zImaginary + cImaginary;

    zReal = newReal;
    zImaginary = newImaginary;

    iteration++;

    if (zReal * zReal + zImaginary * zImaginary > 4) {
      break;
    }
  }

  return iteration;
}

export function generateJulia(
  width,
  height,
  maxIterations,
  cReal,
  cImaginary,
  minReal,
  maxReal,
  minImaginary,
  maxImaginary
) {

  const result = new Uint32Array(width * height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const real =
        minReal +
        (x / (width - 1)) * (maxReal - minReal);

      const imaginary =
        minImaginary +
        (y / (height - 1)) *
        (maxImaginary - minImaginary);

      const iterations = juliaPoint(
        real,
        imaginary,
        cReal,
        cImaginary,
        maxIterations
      );

      const index = y * width + x;
      result[index] = iterations;
    }
  }

  return result;
}

export function computeJuliaChecksum(
  width,
  height,
  maxIterations,
  cReal,
  cImaginary,
  minReal,
  maxReal,
  minImaginary,
  maxImaginary
) {
  let checksum = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const real =
        minReal +
        (x / (width - 1)) *
        (maxReal - minReal);

      const imaginary =
        minImaginary +
        (y / (height - 1)) *
        (maxImaginary - minImaginary);

      checksum += juliaPoint(
        real,
        imaginary,
        cReal,
        cImaginary,
        maxIterations
      );
    }
  }

  return checksum;
}