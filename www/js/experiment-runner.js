import { 
  generateMandelbrot,
  computeMandelbrotChecksum
} from "./mandelbrot.js";

import { 
  generateJulia,
  computeJuliaChecksum
} from "./julia.js";

import {
  generate_mandelbrot,
  generate_julia,
  compute_mandelbrot_checksum,
  compute_julia_checksum
} from "../wasm/scalar/mandelbrot_scalar.js";

import {
  generate_mandelbrot_simd,
  generate_julia_simd,
  compute_mandelbrot_checksum_simd,
  compute_julia_checksum_simd
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

function createMandelbrotComputeImplementations(scenario) {
  const {
    width,
    height,
    maxIterations,
    viewport
  } = scenario;

  return {
    javascript: () =>
      consumeChecksum(
        computeMandelbrotChecksum(
          width,
          height,
          maxIterations,
          viewport.minReal,
          viewport.maxReal,
          viewport.minImaginary,
          viewport.maxImaginary
        )
      ),

    wasmScalar: () =>
      consumeChecksum(
        compute_mandelbrot_checksum(
          width,
          height,
          maxIterations,
          viewport.minReal,
          viewport.maxReal,
          viewport.minImaginary,
          viewport.maxImaginary
        )
      ),

    wasmSimd: () =>
      consumeChecksum(
        compute_mandelbrot_checksum_simd(
          width,
          height,
          maxIterations,
          viewport.minReal,
          viewport.maxReal,
          viewport.minImaginary,
          viewport.maxImaginary
        )
      )
  };
}

function createJuliaComputeImplementations(scenario) {
  const {
    width,
    height,
    maxIterations,
    viewport,
    parameters
  } = scenario;

  return {
    javascript: () =>
      consumeChecksum(
        computeJuliaChecksum(
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
      ),

    wasmScalar: () =>
      consumeChecksum(
        compute_julia_checksum(
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
      ),

    wasmSimd: () =>
      consumeChecksum(
        compute_julia_checksum_simd(
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
      )
  };
}

function createComputeImplementations(scenario) {
  if (scenario.fractal === "mandelbrot") {
    return createMandelbrotComputeImplementations(scenario);
  }

  if (scenario.fractal === "julia") {
    return createJuliaComputeImplementations(scenario);
  }

  throw new Error(
    `Unsupported fractal type: ${scenario.fractal}`
  );
}

function validateChecksumImplementations(
  implementations,
  expectedTotalIterations
) {
  const javascript =
    implementations.javascript();

  const wasmScalar =
    implementations.wasmScalar();

  const wasmSimd =
    implementations.wasmSimd();

  if (!Number.isSafeInteger(javascript)) {
    throw new Error(
      "JavaScript checksum is not a safe integer"
    );
  }

  const javascriptBigInt =
    BigInt(javascript);

  const expectedBigInt =
    BigInt(expectedTotalIterations);

  const implementationsEqual =
    javascriptBigInt === wasmScalar &&
    wasmScalar === wasmSimd;

  const matchesExpectedWorkload =
    javascriptBigInt === expectedBigInt &&
    wasmScalar === expectedBigInt &&
    wasmSimd === expectedBigInt;

  if (!implementationsEqual) {
    throw new Error(
      "Compute-focused checksum mismatch between implementations."
    );
  }

  if (!matchesExpectedWorkload) {
    throw new Error(
      "Compute-focused checksum does not match workload totalIterations."
    );
  }

  return {
    valid: true,
    implementationsEqual,
    matchesExpectedWorkload,

    values: {
      javascript: javascript.toString(),
      wasmScalar: wasmScalar.toString(),
      wasmSimd: wasmSimd.toString(),
      expected: expectedBigInt.toString()
    }
  };
}

let computeFocusedSink;

function consumeChecksum(value) {
  computeFocusedSink = value;
  return value;
}

export function getComputeFocusedSink() {
  return computeFocusedSink;
}

export function runBenchmarkScenario(
  scenario,
  warmupRuns = 5,
  measuredRuns = 30
) {
  validateScenario(scenario);

  const endToEndImplementations =
    createImplementations(scenario);

  const validation =
    validateImplementations(
      endToEndImplementations,
      {
        width: scenario.width,
        maxIterations:
          scenario.maxIterations
      }
    );

  const computeImplementations =
    createComputeImplementations(scenario);

  const checksumValidation =
    validateChecksumImplementations(
      computeImplementations,
      validation.workload.totalIterations
    );

  const endToEndResults =
    benchmarkImplementations(
      endToEndImplementations,
      warmupRuns,
      measuredRuns
    );

  const endToEndSpeedups =
    calculateImplementationSpeedups(
      endToEndResults
    );

  const endToEndSimdVsScalar =
    calculateSimdVsScalarSpeedup(
      endToEndResults
    );

  const computeFocusedResults =
    benchmarkImplementations(
      computeImplementations,
      warmupRuns,
      measuredRuns
    );

  const computeFocusedSpeedups =
    calculateImplementationSpeedups(
      computeFocusedResults
    );

  const computeFocusedSimdVsScalar =
    calculateSimdVsScalarSpeedup(
      computeFocusedResults
    );

  return {
    scenario,
    validation,

    benchmarks: {
      endToEnd: {
        implementations:
          endToEndResults,
        speedups: {
          vsJavaScript:
            endToEndSpeedups,
          wasmSimdVsScalar:
            endToEndSimdVsScalar
        }
      },

      computeFocused: {
        checksumValidation,

        implementations:
          computeFocusedResults,

        speedups: {
          vsJavaScript:
            computeFocusedSpeedups,
          wasmSimdVsScalar:
            computeFocusedSimdVsScalar
        }
      }
    }
  };
}