export function renderFractal(
  canvas,
  iterations,
  width,
  height,
  maxIterations
) {
  const context = canvas.getContext("2d");

  const imageData = context.createImageData(width, height);
  const pixels = imageData.data;

  for (let i = 0; i < iterations.length; i++) {
    const iteration = iterations[i];
    const pixelIndex = i * 4;

    if (iteration == maxIterations) {
      pixels[pixelIndex] = 0;
      pixels[pixelIndex + 1] = 0;
      pixels[pixelIndex + 2] = 0;
    } else {
      const brightness = Math.floor(255 * iteration / maxIterations);

      pixels[pixelIndex] = brightness;
      pixels[pixelIndex + 1] = brightness;
      pixels[pixelIndex + 2] = brightness;
    }

    pixels[pixelIndex + 3] = 255;
  }

  context.putImageData(imageData, 0, 0);
}