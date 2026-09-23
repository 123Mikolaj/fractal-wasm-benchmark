import init from "../wasm/scalar/mandelbrot_scalar.js";
import initSimd from "../wasm/simd/mandelbrot_simd.js";

import {
  renderFractal
} from "./renderer.js";

import {
  generateFractal
} from "./fractal-generator.js";

import {
  experimentScenarios
} from "./experiment-config.js";

import {
  runExperimentSuite
} from "./experiment-suite.js";

import {
  exportExperimentAsJson,
  exportExperimentAsCsv
} from "./result-export.js";

// ----------------------
// Initialization
// ----------------------

await init();
await initSimd();

// ----------------------
// Visualization
// ----------------------

const canvas =
  document.getElementById("fractalCanvas");

const fractalSelect =
  document.getElementById("fractalSelect");

const implementationSelect =
  document.getElementById("implementationSelect");

const resolutionSelect =
  document.getElementById("resolutionSelect");

const maxIterationsInput =
  document.getElementById("maxIterationsInput");

const juliaControls =
  document.getElementById("juliaControls");

const juliaRealInput =
  document.getElementById("juliaRealInput");

const juliaImaginaryInput =
  document.getElementById("juliaImaginaryInput");

const renderButton =
  document.getElementById("renderButton");

const resetSettingsButton =
  document.getElementById("resetSettingsButton");
  
const renderStatus =
  document.getElementById("renderStatus");

  const defaultViewports = {
    mandelbrot: {
      minReal: -2.5,
      maxReal: 1.0,
      minImaginary: -1.2,
      maxImaginary: 1.2
    },

    julia: {
      minReal: -1.8,
      maxReal: 1.8,
      minImaginary: -1.2,
      maxImaginary: 1.2
    }
  };

  let currentViewport = {
    ...defaultViewports.mandelbrot
  };

  function getSelectedResolution() {
    const [width, height] =
      resolutionSelect.value
        .split("x")
        .map(Number);

    return {
      width,
      height
    };
  }

  function updateFractalControls() {
    const isJulia =
      fractalSelect.value === "julia";

    juliaControls.hidden = !isJulia;
  }

  function resetViewport() {
    currentViewport = {
      ...defaultViewports[fractalSelect.value]
    };
  }

  function resetVisualizationSettings() {
    fractalSelect.value = "mandelbrot";
    implementationSelect.value = "wasmSimd";
    resolutionSelect.value = "800x600";
    maxIterationsInput.value = "500";

    juliaRealInput.value = "-0.8";
    juliaImaginaryInput.value = "0.156";

    currentViewport = {
      ...defaultViewports.mandelbrot
    };

    updateFractalControls();
  }

  function renderSelectedFractal() {
    const {
      width,
      height
    } = getSelectedResolution();

    const maxIterations =
      Number(maxIterationsInput.value);

    if (
      !Number.isInteger(maxIterations) ||
      maxIterations <= 0
    ) {
      renderStatus.textContent =
        "Max iterations must be a positive number.";

      return;
    }

    canvas.width = width;
    canvas.height = height;

    renderStatus.textContent =
      "Rendering...";

    try {
      const startTime = performance.now();

      const iterations = generateFractal({
        fractal: fractalSelect.value,
        implementation:
          implementationSelect.value,
        width,
        height,
        maxIterations,
        viewport: currentViewport,
        juliaParameters: {
          cReal: Number(juliaRealInput.value),
          cImaginary:
            Number(juliaImaginaryInput.value)
        }
      });

      renderFractal(
        canvas,
        iterations,
        width,
        height,
        maxIterations
      );

      const elapsedTime =
        performance.now() - startTime;

      renderStatus.textContent =
        `Rendered in ${elapsedTime.toFixed(2)} ms`;
    } catch (error) {
      renderStatus.textContent =
        "RenderingFailed.";

      console.error(
        "Fractal rendering failed:",
        error
      );
    }
  }

  fractalSelect.addEventListener(
    "change",
    () => {
      updateFractalControls();
      resetViewport();
      renderSelectedFractal();
    }
  );

  implementationSelect.addEventListener(
    "change",
    renderSelectedFractal
  );

  resolutionSelect.addEventListener(
    "change",
    renderSelectedFractal
  );

  renderButton.addEventListener(
    "click",
    renderSelectedFractal
  );

  resetSettingsButton.addEventListener(
    "click",
    () => {
      resetVisualizationSettings();
      renderSelectedFractal();
    }
  );

  updateFractalControls();
  renderSelectedFractal();

// ------------------
// Benchmark experiment
// ------------------

const runBenchmarkButton = 
  document.getElementById(
    "runBenchmarkButton"
  );

const benchmarkProgress = 
  document.getElementById(
    "benchmarkProgress"
  );

const benchmarkStatus =
  document.getElementById(
    "benchmarkStatus"
  );

const benchmarkProgressBar =
  document.getElementById(
    "benchmarkProgressBar"
  );

const benchmarkProgressText =
  document.getElementById(
    "benchmarkProgressText"
  );

const benchmarkScenario = 
  document.getElementById(
    "benchmarkScenario"
  );

const exportJsonButton =
  document.getElementById(
    "exportJsonButton"
  );

const exportCsvButton =
  document.getElementById(
    "exportCsvButton"
  );

let latestExperiment = null;

runBenchmarkButton.addEventListener(
  "click",
  async () => {
    runBenchmarkButton.disabled = true;
    benchmarkProgress.hidden = false;

    benchmarkStatus.textContent =
      "Running benchmark...";

    benchmarkProgressBar.value = 0;
    benchmarkProgressBar.max = experimentScenarios.length;

    benchmarkProgressText.textContent =
      `0 / ${experimentScenarios.length}`;

    benchmarkScenario.textContent = "";

    try {
      latestExperiment = 
        await runExperimentSuite(
          experimentScenarios,
          {
            onProgress: progress => {
              benchmarkProgressBar.value =
                progress.completed;

              benchmarkProgressText.textContent =
                `${progress.completed} / ${progress.total}`;

              benchmarkScenario.textContent = 
                progress.scenarioId;

              if (progress.phase === "after") {
                benchmarkStatus.textContent =
                  "Running benchmark...";
              }
            }
          }
        );

      benchmarkStatus.textContent = 
        "Benchmark completed.";

      benchmarkScenario.textContent = "";

      exportJsonButton.disabled = false;
      exportCsvButton.disabled = false;

      console.log(
        "Experiment completed:",
        latestExperiment
      );
    } catch (error) {
      benchmarkStatus.textContent =
        "Benchmark failed.";

      console.log(
        "Benchmark experiment failed:",
        error
      );
    } finally {
      runBenchmarkButton.disabled = false;
    }
  }
);

exportJsonButton.addEventListener(
  "click",
  () => {
    if (latestExperiment === null) {
      return;
    }

    exportExperimentAsJson(
      latestExperiment
    );
  }
);

exportCsvButton.addEventListener(
  "click",
  () => {
    if (latestExperiment === null) {
      return;
    }

    exportExperimentAsCsv(
      latestExperiment
    );
  }
);