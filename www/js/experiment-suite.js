import { runBenchmarkScenario } from "./experiment-runner.js";

function validateBenchmarkConfiguration(
  warmupRuns,
  measuredRuns
) {
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
}

function createExperimentMetadata(
  scenarios,
  warmupRuns,
  measuredRuns
) {
  return {
    startedAt: new Date().toISOString(),

    benchmarkConfiguration: {
      warmupRuns,
      measuredRuns,
      scenarioCount: scenarios.length
    },

    runtimeEnvironment: {
      userAgent: navigator.userAgent,
      hardwareConcurrency:
        navigator.hardwareConcurrency ?? null
    }
  };
}

function yieldToBrowser() {
  return new Promise(resolve => {
    setTimeout(resolve, 0);
  });
}

export async function runExperimentSuite(
  scenarios,
  {
    warmupRuns = 5,
    measuredRuns = 30,
    onProgress = null
  } = {}
) {
  if (!Array.isArray(scenarios)) {
    throw new Error(
      "Experiment scenarios must be an array."
    );
  }

  if (scenarios.length === 0) {
    throw new Error(
      "Experiment scenarios cannot be empty."
    );
  }

  validateBenchmarkConfiguration(
    warmupRuns,
    measuredRuns
  );

  if (
    onProgress !== null &&
    typeof onProgress !== "function"
  ) {
    throw new Error(
      "onProgress must be a function or null."
    );
  }

  const metadata =
    createExperimentMetadata(
      scenarios,
      warmupRuns,
      measuredRuns
    );

  const results = [];

  for (
    let index = 0;
    index < scenarios.length;
    index++
  ) {
    const scenario = scenarios[index];

    onProgress?.({
      phase: "before",
      completed: index,
      total: scenarios.length,
      scenarioIndex: index,
      scenarioId: scenario.id
    });

    await yieldToBrowser();

    const result =
      runBenchmarkScenario(
        scenario,
        warmupRuns,
        measuredRuns
      );

    results.push(result);

    onProgress?.({
      phase: "after",
      completed: index + 1,
      total: scenarios.length,
      scenarioIndex: index,
      scenarioId: scenario.id
    });

    await yieldToBrowser();
  }

  return {
    metadata: {
      ...metadata,
      completedAt: new Date().toISOString()
    },

    results
  };
}