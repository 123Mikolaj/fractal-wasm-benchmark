export function mandelbrotPoint(real, imaginary, maxIterations) {
  let zReal = 0;
  let zImaginary = 0;
  let iteration = 0;

  while (iteration < maxIterations) {
    const newReal = zReal * zReal - zImaginary * zImaginary + real;
    const newImaginary = 2 * zReal * zImaginary + imaginary;

    zReal = newReal;
    zImaginary = newImaginary;

    iteration++;

    if (zReal * zReal + zImaginary * zImaginary > 4) {
      break;
    }
  }

  return iteration;
}

export function generateMandelbrot(
  width, 
  height, 
  maxIterations,
  minReal,
  maxReal,
  minImaginary,
  maxImaginary
) {

  const result = new Uint32Array(width * height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const real = minReal + (x / (width - 1)) * (maxReal - minReal);

      const imaginary = minImaginary + (y / (height - 1)) * (maxImaginary - minImaginary);

      const iterations = mandelbrotPoint(
        real,
        imaginary,
        maxIterations
      );

      const index = y * width + x;
      result[index] = iterations;
    }
  }

  return result;
}