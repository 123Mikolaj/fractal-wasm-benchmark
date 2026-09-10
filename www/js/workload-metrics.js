export function calculateWorkloadMetrics(
  iterations,
  width,
  maxIterations
) {
  if (!iterations || typeof iterations.length !== "number") {
    throw new Error(
      "Iterations must be an array-like object."
    );
  }

  if (iterations.length === 0) {
    throw new Error(
      "Iterations must not be empty."
    );
  }

  if (!Number.isInteger(width) || width <= 1) {
    throw new Error(
      "Width must be an integer greater than 1."
    );
  }

  if (
    !Number.isInteger(maxIterations) || 
    maxIterations <= 0
  ) {
    throw new Error(
      "maxIterations must be a positive integer."
    );
  }

  if (iterations.length % width !== 0) {
    throw new Error(
      "Iteration result length must be divisible by width."
    );
  }

  const height = iterations.length / width;
  const totalPixels = iterations.length;

  let totalIterations = 0;
  let escapedCount = 0;
  let iterationLimitReachedCount = 0;

  let minObservedIterations = Infinity;
  let maxObservedIterations = -Infinity;

  for (let i = 0; i < iterations.length; i++) {
    const value = iterations[i];

    totalIterations += value;

    if (value < maxIterations) {
      escapedCount++;
    } else {
      iterationLimitReachedCount++;
    }

    if (value < minObservedIterations) {
      minObservedIterations = value;
    }

    if (value > maxObservedIterations) {
      maxObservedIterations = value;
    }
  }

  const averageIterations = 
    totalIterations / totalPixels;

  let squaredDifferenceSum = 0;

  for (let i = 0; i < iterations.length; i++) {
    const difference = 
      iterations[i] - averageIterations;

    squaredDifferenceSum += 
      difference * difference;
  }

  const iterationStandardDeviation = 
    totalPixels > 0
      ? Math.sqrt(
        squaredDifferenceSum / 
          totalPixels
      )
    : 0;

  let simdPairCount = 0;
  let simdPairLoopIterations = 0;
  let simdUsefulLaneIterations = 0;
  let simdWastedLaneIterations = 0;

  for (let y = 0; y < height; y++) {
    const rowStart = y * width;

    for (let x = 0; x + 1 < width; x += 2) {
      const first =
        iterations[rowStart + x];

      const second =
        iterations[rowStart + x + 1];

      const pairIterations = 
        Math.max(first, second);

      const usefulIterations =
        first + second;

      const availableLaneIterations =
        2 * pairIterations;

      simdPairCount++;

      simdPairLoopIterations +=
        pairIterations;

      simdUsefulLaneIterations +=
        usefulIterations;

      simdWastedLaneIterations +=
        availableLaneIterations -
        usefulIterations;
    }
  }

  const simdAvailableLaneIterations =
    2 * simdPairLoopIterations;

  const simdIterationUtilization =
    simdAvailableLaneIterations > 0
      ? simdUsefulLaneIterations /
        simdAvailableLaneIterations
      : 1;

  const simdWastedLaneIterationRatio =
    simdAvailableLaneIterations > 0
      ? simdWastedLaneIterations /
        simdAvailableLaneIterations
      : 0;

  return {
    totalPixels,

    totalIterations,
    averageIterations,
    iterationStandardDeviation,

    minObservedIterations,
    maxObservedIterations,

    escapedCount,
    escapedRatio:
      escapedCount / totalPixels,

    iterationLimitReachedCount,
    iterationLimitReachedRatio:
      iterationLimitReachedCount /
      totalPixels,

    simd: {
      pairCount: simdPairCount,

      pairLoopIterations:
        simdPairLoopIterations,

      usefulLaneIterations:
        simdUsefulLaneIterations,

      wastedLaneIterations:
        simdWastedLaneIterations,

      iterationUtilization:
        simdIterationUtilization,

      wastedLaneIterationRatio:
        simdWastedLaneIterationRatio
    }
  };
}