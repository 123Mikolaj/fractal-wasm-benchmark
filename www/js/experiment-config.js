export const experimentScenarios = [
  {
    id: "mandelbrot-full-800x600-500",

    fractal: "mandelbrot",

    width: 800,
    height: 600,

    maxIterations: 500,

    viewport: {
      minReal: -2.5,
      maxReal: 1.0,
      minImaginary: -1.2,
      maxImaginary: 1.2
    }
  },

  {
    id: "julia-default-800x600-500",

    fractal: "julia",

    width: 800,
    height: 600,

    maxIterations: 500,

    viewport: {
      minReal: -1.8,
      maxReal: 1.8,
      minImaginary: -1.2,
      maxImaginary: 1.2
    },

    parameters: {
      cReal: -0.8,
      cImaginary: 0.156
    }
  }
];