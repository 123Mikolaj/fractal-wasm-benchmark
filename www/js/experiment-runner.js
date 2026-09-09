import { generateMandelbrot } from "./mandelbrot.js";
import { generateJulia } from "./julia.js";

import {
  generate_mandelbrot,
  generate_julia
} from "../wasm/scalar/mandelbrot_scalar.js";

import {
  generate_mandelbrot_simd,
  generate_julia_simd
} from "../wasm/simd/mandelbrot_simd.js";

import {
  benchmarkImplementations,
  calculateImplementationSpeedups,
  calculateSimdVsScalarSpeedup
} from "./benchmark.js";

import {
  validateImplementations
} from "./validation.js";

function validateScenario(scenario) {
  if (!scenario || typeof scenario !== "object") {
    throw new Error("Scenario must be an object.");
  }

  if (!scenario.id) {
    throw new Error("Scenario must have an id.");
  }

  if (
    scenario.fractal !== "mandelbrot" &&
    scenario.fractal !== "julia"
  ) {
    throw new Error(
      `Unsupported fractal type: ${scenario.fractal}`
    );
  }

  if (
    !Number.isInteger(scenario.width) || scenario.width <= 1
  ) {
    throw new Error(
      `Invalid width in scenario: ${scenario.id}`
    );
  }

  if (
    !Number.isInteger(scenario.height) || scenario.height <= 1
  ) {
    throw new Error(
      `Invalid height in scenario: ${scenario.id}`
    );
  }

  if (
    !Number.isInteger(scenario.maxIterations) || scenario.maxIterations <= 0
  ) {
    throw new Error(
      `Invalid maxIterations in scenario: ${scenario.id}`
    );
  }

  const viewport = scenario.viewport;

  if (!viewport) {
    throw new Error(
      `Missing viewport in scenario: ${scenario.id}`
    );
  }

  const {
    minReal,
    maxReal,
    minImaginary,
    maxImaginary
  } = viewport;

  if (
    !Number.isFinite(minReal) ||
    !Number.isFinite(maxReal) ||
    !Number.isFinite(minImaginary) ||
    !Number.isFinite(maxImaginary)
  ) {
    throw new Error(
      `Invalid viewport values in scenario: ${scenario.id}`
    );
  }

  if (
    minReal >= maxReal ||
    minImaginary >= maxImaginary
  ) {
    throw new Error(
      `Invalid viewport bounds in scenario: ${scenario.id}`
    );
  }

  if (scenario.fractal === "julia") {
    const parameters = scenario.parameters;

    if (!parameters) {
      throw new Error(
        `Missing Julia parameters in scenario: ${scenario.id}`
      );
    }

    if (
      !Number.isFinite(parameters.cReal) ||
      !Number.isFinite(parameters.cImaginary)
    ) {
      throw new Error(
        `Invalid Julia parameters in scenario: ${scenario.id}`
      );
    }
  }
}

function createMandelbrotImplementations(scenario) {
  const {
    width,
    height,
    maxIterations,
    viewport
  } = scenario;

  return {
    javascript: () =>
      generateMandelbrot(
        width,
        height,
        maxIterations,
        viewport.minReal,
        viewport.maxReal,
        viewport.minImaginary,
        viewport.maxImaginary
      ),

      wasmScalar: () =>
        generate_mandelbrot(
          width,
          height,
          maxIterations,
          viewport.minReal,
          viewport.maxReal,
          viewport.minImaginary,
          viewport.maxImaginary
        ),
      
      wasmSimd: () =>
        generate_mandelbrot_simd(
          width,
          height,
          maxIterations,
          viewport.minReal,
          viewport.maxReal,
          viewport.minImaginary,
          viewport.maxImaginary
        )
  };
}

function createJuliaImplementations(scenario) {
  const {
    width,
    height,
    maxIterations,
    viewport,
    parameters
  } = scenario;

  return {
    javascript: () =>
      generateJulia(
        width,
        height,
        maxIterations,
        parameters.cReal,
        parameters.cImaginary,
        viewport.minReal,
        viewport.maxReal,
        viewport.minImaginary,
        viewport.maxImaginary
      ),

    wasmScalar: () =>
      generate_julia(
        width,
        height,
        maxIterations,
        parameters.cReal,
        parameters.cImaginary,
        viewport.minReal,
        viewport.maxReal,
        viewport.minImaginary,
        viewport.maxImaginary
      ),

    wasmSimd: () =>
      generate_julia_simd(
        width,
        height,
        maxIterations,
        parameters.cReal,
        parameters.cImaginary,
        viewport.minReal,
        viewport.maxReal,
        viewport.minImaginary,
        viewport.maxImaginary
      )
  };
}

function createImplementations(scenario) {
  if (scenario.fractal === "mandelbrot") {
    return createMandelbrotImplementations(scenario);
  }

  if (scenario.fractal === "julia") {
    return createJuliaImplementations(scenario);
  }

  throw new Error(
    `Unsupported fractal type: ${scenario.fractal}`
  );
}

export function runBenchmarkScenario(
  scenario,
  warmupRuns = 5,
  measuredRuns = 30
) {
  validateScenario(scenario);

  const implementations = 
    createImplementations(scenario);

  const validation = 
    validateImplementations(
      implementations
    );

  const benchmarkResults = 
    benchmarkImplementations(
      implementations,
      warmupRuns,
      measuredRuns
    );

  const speedups =
    calculateImplementationSpeedups(
      benchmarkResults
    );

  const simdVsScalar = 
    calculateSimdVsScalarSpeedup(
      benchmarkResults
    );

  return {
    scenario,
    validation,
    implementations: benchmarkResults,
    speedups: {
      vsJavaScript: speedups,
      wasmSimdVsScalar: simdVsScalar
    }
  };
}