import { mandelbrotPoint } from "./mandelbrot.js";

const maxIterations = 500;

console.log("c = 0:", mandelbrotPoint(0, 0, maxIterations));
console.log("c = -1:", mandelbrotPoint(-1, 0, maxIterations));
console.log("c = 1:", mandelbrotPoint(1, 0, maxIterations));
console.log("c = 2:", mandelbrotPoint(2, 0, maxIterations));