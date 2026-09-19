import init from "../wasm/scalar/mandelbrot_scalar.js"

import initSimd, {
  generate_mandelbrot_simd
} from "../wasm/simd/mandelbrot_simd.js";

import { renderMandelbrot } from "./renderer.js";
import { experimentScenarios } from "./experiment-config.js";
import { runExperimentSuite } from "./experiment-suite.js";
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
// Default configuration
// ----------------------

const canvas = document.getElementById("fractalCanvas");

const width = canvas.width;
const height = canvas.height;
const maxIterations = 500;

const mandelbrotViewport = {
  minReal: -2.5,
  maxReal: 1.0,
  minImaginary: -1.2,
  maxImaginary: 1.2
};

// ---------------
// Render
// ---------------

const simdIterations = generate_mandelbrot_simd(
  width,
  height,
  maxIterations,
  mandelbrotViewport.minReal,
  mandelbrotViewport.maxReal,
  mandelbrotViewport.minImaginary,
  mandelbrotViewport.maxImaginary
);

renderMandelbrot(
  canvas,
  simdIterations,
  width,
  height,
  maxIterations
);

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