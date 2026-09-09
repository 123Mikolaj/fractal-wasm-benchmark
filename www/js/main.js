import init from "../wasm/scalar/mandelbrot_scalar.js";

import initSimd, {
  generate_mandelbrot_simd
} from "../wasm/simd/mandelbrot_simd.js";

import { renderMandelbrot } from "./renderer.js";
import { experimentScenarios } from "./experiment-config.js";
import { runBenchmarkScenario } from "./experiment-runner.js";

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

// ----------------------
// Benchmark scenarios
// ----------------------

console.log("--- BENCHMARK SCENARIOS ---");

for (const scenario of experimentScenarios) {
  console.log(
    "Running scenario:",
    scenario.id
  );

  const result = 
    runBenchmarkScenario(
      scenario
    );

  console.log(
    "Scenario result:",
    result
  );
}

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