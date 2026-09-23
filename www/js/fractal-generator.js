import {
  generateMandelbrot
} from "./mandelbrot.js";

import {
  generateJulia
} from "./julia.js";

import {
  generate_mandelbrot,
  generate_julia
} from "../wasm/scalar/mandelbrot_scalar.js";

import {
  generate_mandelbrot_simd,
  generate_julia_simd
} from "../wasm/simd/mandelbrot_simd.js";

export function generateFractal({
  fractal,
  implementation,
  width,
  height,
  maxIterations,
  viewport,
  juliaParameters
}) {
  if (fractal === "mandelbrot") {
    if (implementation === "javascript") {
      return generateMandelbrot(
        width,
        height,
        maxIterations,
        viewport.minReal,
        viewport.maxReal,
        viewport.minImaginary,
        viewport.maxImaginary
      );
    }

    if (implementation === "wasmScalar") {
      return generate_mandelbrot(
        width,
        height,
        maxIterations,
        viewport.minReal,
        viewport.maxReal,
        viewport.minImaginary,
        viewport.maxImaginary
      );
    }

    if (implementation === "wasmSimd") {
      return generate_mandelbrot_simd(
        width,
        height,
        maxIterations,
        viewport.minReal,
        viewport.maxReal,
        viewport.minImaginary,
        viewport.maxImaginary
      );
    }
  }

  if (fractal === "julia") {
    const {
      cReal,
      cImaginary
    } = juliaParameters;

    if (implementation === "javascript") {
      return generateJulia(
        width,
        height,
        maxIterations,
        cReal,
        cImaginary,
        viewport.minReal,
        viewport.maxReal,
        viewport.minImaginary,
        viewport.maxImaginary
      );
    }

    if (implementation === "wasmScalar") {
      return generate_julia(
        width,
        height,
        maxIterations,
        cReal,
        cImaginary,
        viewport.minReal,
        viewport.maxReal,
        viewport.minImaginary,
        viewport.maxImaginary
      );
    }

    if (implementation === "wasmSimd") {
      return generate_julia_simd(
        width,
        height,
        maxIterations,
        cReal,
        cImaginary,
        viewport.minReal,
        viewport.maxReal,
        viewport.minImaginary,
        viewport.maxImaginary
      );
    }
  }

  throw new Error(
    `Unsupported fractal/implementation: ${fractal}/${implementation}`
  );
}