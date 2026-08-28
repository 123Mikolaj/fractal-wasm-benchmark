import init, { 
  generate_mandelbrot 
} from "../wasm/scalar/mandelbrot_scalar.js"
import { generateMandelbrot } from "./mandelbrot.js";
import { renderMandelbrot } from "./renderer.js";

await init();

const canvas = document.getElementById("fractalCanvas");

const width = canvas.width;
const height = canvas.height;
const maxIterations = 500;

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

console.log("JS length:", jsIterations.length);
console.log("WASM length:", wasmIterations.length);

let differences = 0;

for(let i = 0; i < jsIterations.length; i++) {
  if(jsIterations[i] !== wasmIterations[i]) {
    differences++;
  }
}

console.log("JS/WASM differences:", differences);

renderMandelbrot(
  canvas,
  wasmIterations,
  width,
  height,
  maxIterations
);