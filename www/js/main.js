import init, { 
  generate_mandelbrot 
} from "../wasm/scalar/mandelbrot_scalar.js";

import initSimd, {
  generate_mandelbrot_simd
} from "../wasm/simd/mandelbrot_simd.js";

import { generateMandelbrot } from "./mandelbrot.js";
import { renderMandelbrot } from "./renderer.js";

await init();
await initSimd();

const canvas = document.getElementById("fractalCanvas");

const width = canvas.width;
const height = canvas.height;
const maxIterations = 500;

// ---------------
// Generate results
// ---------------

const jsIterations = generateMandelbrot(
  width,
  height,
  maxIterations
);

const wasmIterations = generate_mandelbrot(
  width,
  height,
  maxIterations
);

const simdIterations = generate_mandelbrot_simd(
  width,
  height,
  maxIterations
);

// ---------------
//Validate results
// ---------------

console.log("JS length:", jsIterations.length);
console.log("WASM length:", wasmIterations.length);
console.log("SIMD length:", simdIterations.length);

let differences = 0;

for(let i = 0; i < jsIterations.length; i++) {
  if(jsIterations[i] !== wasmIterations[i]) {
    differences++;
  }
}

console.log("JS/WASM differences:", differences);

let simdDifferences = 0;

for(let i = 0; i < jsIterations.length; i++) {
  if(jsIterations[i] !== simdIterations[i]) {
    simdDifferences++;
  }
}

console.log("JS/SIMD differences", simdDifferences);

// ---------------
// Temporary sanity benchmark
// ---------------

function measureExecutionTime(name, fn, runs = 10) {
  const times = [];

  for (let i = 0; i < 3; i++) {
    fn();
  }

  for(let i = 0; i < runs; i++) {
    const start = performance.now();

    fn();

    const end = performance.now();
    times.push(end - start);
  }

  const average =
    times.reduce((sum, time) => sum + time, 0) / times.length;

  console.log(`${name}:`);
  console.log("Times:", times);
  console.log("Average:", average.toFixed(3), "ms");
}

console.log("--- SANITY BENCHMARK ---");

measureExecutionTime(
  "JavaScript",
  () => generateMandelbrot(width, height, maxIterations)
);

measureExecutionTime(
  "WASM scalar",
  () => generate_mandelbrot(width, height, maxIterations)
);

measureExecutionTime(
  "WASM SIMD",
  () => generate_mandelbrot_simd(width, height, maxIterations)
);

// ---------------
// Render
// ---------------

renderMandelbrot(
  canvas,
  simdIterations,
  width,
  height,
  maxIterations
);