const resolutions = [
  {
    name: "800x600",
    width: 800,
    height: 600
  },
  {
    name: "1280x720",
    width: 1280,
    height: 720
  },
  {
    name: "1920x1080",
    width: 1920,
    height:1080
  }
];

const iterationLimits = [
  250,
  500,
  1000
];

const mandelbrotViewport = {
  minReal: -2.5,
  maxReal: 1.0,
  minImaginary: -1.2,
  maxImaginary: 1.2
};

const juliaViewport = {
  minReal: -1.8,
  maxReal: 1.8,
  minImaginary: -1.2,
  maxImaginary: 1.2
};

const juliaParameters = {
  cReal: -0.8,
  cImaginary: 0.156
};

const workloadResolution = {
  name: "1280x720",
  width: 1280,
  height: 720
};

const workloadMaxIterations = 1000;

const mandelbrotWorkloadRegions = [
  {
    name: "interior",

    viewport: {
      minReal: -0.2,
      maxReal: 0.2,
      minImaginary: -0.2,
      maxImaginary: 0.2
    }
  },

  {
    name: "boundary",

    viewport: {
      minReal: -0.8,
      maxReal: -0.7,
      minImaginary: 0.0,
      maxImaginary: 0.1
    }
  }
];

const juliaWorkloadParameters = [
  {
    name: "preset-b",
    cReal: 0.285,
    cImaginary: 0.01
  },

  {
    name: "preset-c",
    cReal: -0.4,
    cImaginary: 0.6
  }
];

function createMandelbrotScenarios() {
  const scenarios = [];

  for (const resolution of resolutions) {
    for (const maxIterations of iterationLimits) {
      scenarios.push({
        id:
          `mandelbrot-full-${resolution.name}-${maxIterations}`,

        fractal: "mandelbrot",

        width: resolution.width,
        height: resolution.height,

        maxIterations,

        viewport: {
          ...mandelbrotViewport
        }
      });
    }
  }

  return scenarios;
}

function createJuliaScenarios() {
  const scenarios = [];

  for (const resolution of resolutions) {
    for (const maxIterations of iterationLimits) {
      scenarios.push({
        id:
          `julia-default-${resolution.name}-${maxIterations}`,

        fractal: "julia",

        width: resolution.width,
        height: resolution.height,

        maxIterations,

        viewport: {
          ...juliaViewport
        },

        parameters: {
          ...juliaParameters
        }
      });
    }
  }

  return scenarios;
}

function createMandelbrotWorkloadScenarios() {
  const scenarios = [];

  for (const region of mandelbrotWorkloadRegions) {
    scenarios.push({
      id:
        `mandelbrot-${region.name}-` + 
        `${workloadResolution.name}-` + 
        `${workloadMaxIterations}`,

      fractal: "mandelbrot",

      width: workloadResolution.width,
      height: workloadResolution.height,

      maxIterations: workloadMaxIterations,

      viewport: {
        ...region.viewport
      }
    });
  }

  return scenarios;
}

function createJuliaWorkloadScenarios() {
  const scenarios = [];

  for (const parameters of juliaWorkloadParameters) {
    scenarios.push({
      id:
        `julia-${parameters.name}-` + 
        `${workloadResolution.name}-` + 
        `${workloadMaxIterations}`,

      fractal: "julia",

      width: workloadResolution.width,
      height: workloadResolution.height,

      maxIterations: workloadMaxIterations,

      viewport: {
        ...juliaViewport
      },

      parameters: {
        cReal: parameters.cReal,
        cImaginary: parameters.cImaginary
      }
    });
  }

  return scenarios;
}

function validateUniqueScenarioIds(scenarios) {
  const ids = new Set();

  for (const scenario of scenarios) {
    if (ids.has(scenario.id)) {
      throw new Error(
        `Duplicate scenario id: ${scenario.id}`
      );
    }

    ids.add(scenario.id);
  }
}

export const experimentScenarios = [
  ...createMandelbrotScenarios(),
  ...createJuliaScenarios(),

  ...createMandelbrotWorkloadScenarios(),
  ...createJuliaWorkloadScenarios()
];

validateUniqueScenarioIds(
  experimentScenarios
);