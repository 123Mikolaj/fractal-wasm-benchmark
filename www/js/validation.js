function compareResults(
  reference,
  compared,
  referenceName,
  comparedName
) {
  if (reference.length !== compared.length) {
    throw new Error(
      `Result length mismatch: ${referenceName}=${reference.length}, ` + 
      `${comparedName}=${compared.length}`
    );
  }

  let differences = 0;
  let firstDifferenceIndex = null;

  for (let i = 0; i < reference.length; i++) {
    if (reference[i] !== compared[i]) {
      differences++;

      if (firstDifferenceIndex === null) {
        firstDifferenceIndex = i;
      }
    }
  }

  return {
    differences,
    firstDifferenceIndex
  };
}

export function validateImplementations(
  implementations
) {
  if (
    !implementations ||
    typeof implementations !== "object"
  ) {
    throw new Error(
      "Implementations must be provided as an object."
    );
  }

  const {
    javascript,
    wasmScalar,
    wasmSimd
  } = implementations;

  if (
    typeof javascript !== "function" ||
    typeof wasmScalar !== "function" ||
    typeof wasmSimd !== "function"
  ) {
    throw new Error(
      "JavaScript, wasmScalar and wasmSimd implementations are required."
    );
  }

  const javascriptResult = javascript();
  const wasmScalarResult = wasmScalar();
  const wasmSimdResult = wasmSimd();

  const scalarComparison = compareResults(
    javascriptResult,
    wasmScalarResult,
    "javascript",
    "wasmScalar"
  );

  const simdComparison = compareResults(
    javascriptResult,
    wasmSimdResult,
    "javascript",
    "wasmSimd"
  );

  if (scalarComparison.differences > 0) {
    throw new Error(
      `JavaScript and scalar WASM results differ at ` + 
      `${scalarComparison.differences} positions. ` + 
      `First difference at index ` +
      `${scalarComparison.firstDifferenceIndex}.`
    );
  }

  if (simdComparison.differences > 0) {
    throw new Error(
      `JavaScript and SIMD WASM results differ at ` + 
      `${simdComparison.differences} positions. ` + 
      `First difference at index ` +
      `${simdComparison.firstDifferenceIndex}.`
    );
  }

  return {
    outputLength: javascriptResult.length,

    javascriptVsWasmScalar: {
      differences: scalarComparison.differences
    },

    javascriptVsWasmSimd: {
      differences: simdComparison.differences
    },

    valid: true
  };
}