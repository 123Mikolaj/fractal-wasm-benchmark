function createTimestampForFilename() {
  return new Date()
    .toISOString()
    .replace(/[:.]/g, "-");
}

function downloadFile(
  content,
  filename,
  mimeType
) {
  const blob = new Blob(
    [content],
    { type: mimeType }
  );

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);

  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

export function exportExperimentAsJson(
  experiment
) {
  if (
    experiment === null ||
    typeof experiment !== "object"
  ) {
    throw new Error(
      "Experiment data must be an object."
    );
  }

  const json =
    JSON.stringify(
      experiment,
      null,
      2
    );

  const timestamp =
    createTimestampForFilename();

  const filename = 
    `fractal-benchmark-${timestamp}.json`;

  downloadFile(
    json,
    filename,
    "application/json;charset-utf-8"
  );
}

function escapeCsvValue(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  const stringValue =
    String(value);

  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n")
  ) {
    return `"${stringValue.replace(
      /"/g,
      '""'
    )}"`;
  }

  return stringValue;
}

function createCsvRows(experiment) {
  const rows = [];

  for (const result of experiment.results) {
    const scenario = result.scenario;
    const workload = result.validation.workload;

    const benchmarkModes = [
      ["endToEnd", result.benchmarks.endToEnd],
      [
        "computeFocused",
        result.benchmarks.computeFocused
      ]
    ];

    for (
      const [benchmarkMode, benchmark]
      of benchmarkModes
    ) {
      for (
        const implementationName
        of [
          "javascript",
          "wasmScalar",
          "wasmSimd"
        ]
      ) {
        const implementation =
          benchmark.implementations[
            implementationName
          ];

        const speedupVsJavaScript =
          benchmark.speedups.vsJavaScript[
            implementationName
          ];

        rows.push({
          scenarioId: scenario.id,
          fractal: scenario.fractal,
          width: scenario.width,
          height: scenario.height,
          maxIterations:
            scenario.maxIterations,

          minReal:
            scenario.viewport.minReal,
          maxReal:
            scenario.viewport.maxReal,
          minImaginary:
            scenario.viewport.minImaginary,
          maxImaginary:
            scenario.viewport.maxImaginary,

          cReal:
            scenario.parameters?.cReal ?? "",
          cImaginary:
            scenario.parameters?.cImaginary ?? "",

          benchmarkMode,
          implementation:
            implementationName,

          meanMs:
            implementation.statistics.mean,
          medianMs:
            implementation.statistics.median,
          minMs:
            implementation.statistics.min,
          maxMs:
            implementation.statistics.max,
          standardDeviationMs:
            implementation.statistics
              .standardDeviation,

          speedupVsJavaScriptMean:
            speedupVsJavaScript.mean,
          speedupVsJavaScriptMedian:
            speedupVsJavaScript.median,

          simdVsScalarMean:
            benchmark.speedups
              .wasmSimdVsScalar.mean,
          simdVsScalarMedian:
            benchmark.speedups
              .wasmSimdVsScalar.median,

          totalPixels:
            workload.totalPixels,
          totalIterations:
            workload.totalIterations,
          averageIterations:
            workload.averageIterations,
          iterationStandardDeviation:
            workload.iterationStandardDeviation,
          minObservedIterations:
            workload.minObservedIterations,
          maxObservedIterations:
            workload.maxObservedIterations,
          escapedCount:
            workload.escapedCount,
          escapedRatio:
            workload.escapedRatio,
          iterationLimitReachedCount:
            workload.iterationLimitReachedCount,
          iterationLimitReachedRatio:
            workload.iterationLimitReachedRatio,

          simdPairCount:
            workload.simd.pairCount,
          simdPairLoopIterations:
            workload.simd
              .pairLoopIterations,
          simdUsefulLaneIterations:
            workload.simd
              .usefulLaneIterations,
          simdWastedLaneIterations:
            workload.simd
              .wastedLaneIterations,
          simdIterationUtilization:
            workload.simd
              .iterationUtilization,
          simdWastedLaneIterationRatio:
            workload.simd
              .wastedLaneIterationRatio
        });
      }
    }
  }

  return rows;
}

export function exportExperimentAsCsv(
  experiment
) {
  if (
    experiment === null ||
    typeof experiment !== "object"
  ) {
    throw new Error(
      "Experiment data must be an object."
    );
  }

  if (
    !Array.isArray(experiment.results)
  ) {
    throw new Error(
      "Experiment results must be an array."
    );
  }

  const rows =
    createCsvRows(experiment);

  if (rows.length === 0) {
    throw new Error(
      "Experiment results cannot be empty."
    );
  }

  const headers =
    Object.keys(rows[0]);

  const csvLines = [
    headers
      .map(escapeCsvValue)
      .join(",")
  ];

  for (const row of rows) {
    const line =
      headers
        .map(header =>
          escapeCsvValue(row[header])
        )
        .join(",");

      csvLines.push(line);
  }

  const csv =
    csvLines.join("\r\n");

  const timestamp =
    createTimestampForFilename();

  const filename =
    `fractal-benchmark-${timestamp}.csv`;

  downloadFile(
    csv,
    filename,
    "text/csv;charset=utf-8"
  );
}