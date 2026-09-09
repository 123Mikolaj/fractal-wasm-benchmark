export function calculateStatistics(times) {
  if (!Array.isArray(times) || times.length === 0) {
    throw new Error(
      "Times array must contain at least one measurement."
    );
  }

  const sortedTimes = [...times].sort((a, b) => a - b);

  const sum = times.reduce(
    (total, time) => total + time,
    0
  );

  const mean = sum / times.length;

  let median;

  if (sortedTimes.length % 2 === 0) {
    const middle = sortedTimes.length / 2;

    median =
      (
        sortedTimes[middle - 1]
        + sortedTimes[middle]
      ) / 2;
  } else {
    median =
      sortedTimes[
        Math.floor(sortedTimes.length / 2)
      ];
  }

  const min = sortedTimes[0];
  const max = sortedTimes[sortedTimes.length - 1];

  let standardDeviation = 0;

  if (times.length > 1) {
    const variance =
      times.reduce(
        (sum, time) =>
          sum + Math.pow(time - mean, 2),
        0
      ) / (times.length - 1);

    standardDeviation = Math.sqrt(variance);
  }

  return {
    mean,
    median,
    min,
    max,
    standardDeviation
  };
}

export function benchmarkFunction(
  fn,
  warmupRuns = 5,
  measuredRuns = 30
) {
  if (typeof fn !== "function") {
    throw new Error(
      "Benchmark target must be a function."
    );
  }

  if (
    !Number.isInteger(warmupRuns) ||
    warmupRuns < 0
  ) {
    throw new Error(
      "warmupRuns must be a non-negative integer."
    );
  }

  if (
    !Number.isInteger(measuredRuns) ||
    measuredRuns <= 0
  ) {
    throw new Error(
      "measuredRuns must be a positive integer."
    );
  }
  
  for (let i = 0; i < warmupRuns; i++) {
    fn();
  }

  const times = [];

  for (let i = 0; i < measuredRuns; i++) {
    const start = performance.now();

    fn();

    const end = performance.now();

    times.push(end - start);
  }

  return {
    times,
    statistics: calculateStatistics(times)
  };
}

export function benchmarkImplementations(
  implementations,
  warmupRuns = 5,
  measuredRuns = 30
) {
  if (
    !implementations || 
    typeof implementations !== "object"
  ) {
    throw new Error(
      "Implementations must be provided as an object."
    );
  }
  const results = {};

  for (const [name, fn] of Object.entries(implementations)) {
    results[name] = benchmarkFunction(
      fn,
      warmupRuns,
      measuredRuns
    );
  }

  return results;
}

export function calculateSpeedup(
  baselineTime, 
  comparedTime
) {
  if (
    !Number.isFinite(baselineTime) ||
    !Number.isFinite(comparedTime) ||
    baselineTime <= 0 ||
    comparedTime <= 0
  ) {
    throw new Error(
      "Speedup times must be positive finite numbers."
    );
  }

  return baselineTime / comparedTime;
}

export function calculateImplementationSpeedups(
  results,
  baselineName = "javascript"
) {
  const baseline = results[baselineName];

  if (!baseline) {
    throw new Error(
      `Missing baseline implementation: ${baselineName}`
    );
  }

  const speedups = {};

  for (const [name, result] of Object.entries(results)) {
    speedups[name] = {
      mean: calculateSpeedup(
        baseline.statistics.mean,
        result.statistics.mean
      ),

      median: calculateSpeedup(
        baseline.statistics.median,
        result.statistics.median
      )
    };
  }

  return speedups;
}

export function calculateSimdVsScalarSpeedup(results) {
  const scalar = results.wasmScalar;
  const simd = results.wasmSimd;

  if (!scalar || !simd) {
    throw new Error(
      "Both wasmScalar and wasmSimd results are required."
    );
  }

  return {
    mean: calculateSpeedup(
      scalar.statistics.mean,
      simd.statistics.mean
    ),

    median: calculateSpeedup(
      scalar.statistics.median,
      simd.statistics.median
    )
  };
}