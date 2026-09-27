# Project structure

This document describes the logical structure of the project and the
responsibilities of its main modules.

The project consists of three main parts:

-   project documentation,
-   Rust/WebAssembly implementations,
-   browser application and benchmarking infrastructure.

## Repository structure

``` text
fractal-wasm-benchmark/
├── notes/
│   ├── development-log.md
│   ├── environment-setup.md
│   ├── project-structure.md
│   └── thesis-sources.md
│
├── rust/
│   ├── mandelbrot-scalar/
│   │   ├── Cargo.toml
│   │   ├── Cargo.lock
│   │   ├── src/
│   │   │   └── lib.rs
│   │   └── pkg/
│   │
│   └── mandelbrot-simd/
│       ├── Cargo.toml
│       ├── Cargo.lock
│       ├── src/
│       │   └── lib.rs
│       └── pkg/
│
└── www/
    ├── index.html
    ├── css/
    ├── js/
    │   ├── benchmark.js
    │   ├── experiment-config.js
    │   ├── experiment-runner.js
    │   ├── experiment-suite.js
    │   ├── fractal-generator.js
    │   ├── julia.js
    │   ├── main.js
    │   ├── mandelbrot.js
    │   ├── renderer.js
    │   ├── result-export.js
    │   ├── test.js
    │   ├── validation.js
    │   └── workload-metrics.js
    │
    └── wasm/
        ├── scalar/
        └── simd/
```

Generated Cargo `target/` directories are omitted from the simplified
structure because they contain build artifacts rather than project
source code.

## Documentation

### `notes/development-log.md`

Chronological development log.

Contains information about:

-   implementation progress,
-   important technical decisions,
-   benchmark pipeline development,
-   correctness validation,
-   experiment preparation,
-   methodological decisions.

The file is intended to make later reconstruction of the development
process and thesis methodology easier.

### `notes/environment-setup.md`

Description of the development and experimental environment.

Contains information about:

-   hardware,
-   operating system,
-   browser,
-   Rust toolchain,
-   WebAssembly target,
-   wasm-pack,
-   development server,
-   build and execution commands.

The file is also used as a basis for documenting the experimental
environment in the thesis.

### `notes/thesis-sources.md`

Source ledger for the thesis.

Contains:

-   academic publications,
-   technical specifications,
-   official documentation,
-   methodological sources,
-   notes describing which thesis claims each source may support.

Sources should be verified again before being cited in the final thesis.

### `notes/project-structure.md`

Description of the repository structure and module responsibilities.

The document may later be used as a basis for the architecture and
implementation chapter of the thesis.

## Rust and WebAssembly implementations

The `rust/` directory contains two independent Rust crates compiled to
WebAssembly.

Both crates implement:

-   Mandelbrot set generation,
-   Julia set generation,
-   full-output generators,
-   checksum-based compute-focused variants.

### `rust/mandelbrot-scalar/`

Contains the scalar WebAssembly implementation.

Despite the historical `mandelbrot-scalar` name, the crate now contains
both Mandelbrot and Julia implementations.

The name was introduced when the project initially focused only on the
Mandelbrot set and was retained after the project was extended with the
Julia set in order to avoid unnecessary changes to established build
paths and generated package names.

Main source file:

``` text
rust/mandelbrot-scalar/src/lib.rs
```

The crate is compiled using `wasm-pack` for the `web` target.

Generated bindings and WebAssembly binaries are placed in `pkg/` and
selected output files are copied to:

``` text
www/wasm/scalar/
```

### `rust/mandelbrot-simd/`

Contains the WebAssembly SIMD implementation.

Like the scalar crate, it contains both Mandelbrot and Julia algorithms.

The implementation uses WebAssembly SIMD operations and is compiled with
the `simd128` target feature enabled.

Main source file:

``` text
rust/mandelbrot-simd/src/lib.rs
```

Generated output is copied to:

``` text
www/wasm/simd/
```

## Browser application

The `www/` directory contains the browser application.

It is served locally during development and experimentation using a
simple HTTP server.

### `www/index.html`

Main application page.

Contains:

-   visualization controls,
-   fractal selection,
-   implementation selection,
-   resolution selection,
-   maximum iteration controls,
-   Julia parameters,
-   rendering controls,
-   benchmark controls,
-   result export controls,
-   canvas element used for fractal visualization.

### `www/css/`

Directory reserved for application styling.

Visual styling is secondary to the experimental functionality of the
project and may be extended after the benchmarking pipeline is complete.

## JavaScript modules

### `www/js/mandelbrot.js`

JavaScript implementation of the Mandelbrot algorithm.

Contains:

-   point evaluation,
-   complete fractal generation,
-   checksum-based compute-focused generation.

This implementation acts as the JavaScript comparison baseline.

### `www/js/julia.js`

JavaScript implementation of the Julia set algorithm.

Contains:

-   point evaluation,
-   complete fractal generation,
-   checksum-based compute-focused generation.

### `www/js/fractal-generator.js`

Provides a common dispatch layer for interactive fractal generation.

Selects the correct implementation depending on:

-   fractal type,
-   JavaScript / WebAssembly scalar / WebAssembly SIMD implementation,
-   resolution,
-   iteration limit,
-   viewport,
-   Julia parameters.

This module is primarily used by the interactive visualization.

### `www/js/renderer.js`

Responsible for converting generated iteration data into image pixels
and displaying the result on the HTML canvas.

Canvas rendering is intentionally separated from the scientific
benchmark timing.

### `www/js/main.js`

Main application entry point.

Responsibilities include:

-   initialization of WebAssembly modules,
-   user interface event handling,
-   interactive fractal rendering,
-   experiment suite execution,
-   progress reporting,
-   result export.

Interactive rendering times shown in the user interface are not used as
scientific benchmark results.

## Benchmarking infrastructure

### `www/js/benchmark.js`

Contains low-level benchmark utilities.

Responsibilities include:

-   warm-up execution,
-   repeated timing measurements,
-   deterministic balanced rotation of implementations,
-   statistical calculations,
-   speedup calculations,
-   throughput calculations.

Calculated timing statistics include:

-   mean,
-   median,
-   minimum,
-   maximum,
-   sample standard deviation,
-   coefficient of variation.

Derived throughput metrics include:

-   MPixels/s,
-   MIterations/s.

### `www/js/experiment-config.js`

Defines the complete set of experimental scenarios.

The scenario configuration varies:

-   fractal type,
-   resolution,
-   maximum iteration limit,
-   Mandelbrot viewport,
-   Julia parameters.

The main experiment contains 22 scenarios.

These include:

-   9 Mandelbrot full-view scenarios,
-   9 Julia default-view scenarios,
-   2 Mandelbrot workload-specific scenarios,
-   2 Julia workload-specific scenarios.

### `www/js/experiment-runner.js`

Executes a single benchmark scenario.

Responsibilities include:

1.  scenario validation,
2.  creation of matching JavaScript, scalar WebAssembly and SIMD
    implementations,
3.  full-output correctness validation,
4.  workload metric calculation,
5.  checksum correctness validation,
6.  end-to-end benchmark execution,
7.  compute-focused benchmark execution,
8.  throughput calculation,
9.  speedup calculation,
10. construction of the structured scenario result.

Two benchmark modes are used.

#### End-to-end / full-output mode

Measures complete fractal result generation, including creation and
materialization of the full result made available to JavaScript.

Canvas rendering is excluded.

#### Compute-focused mode

Performs the same fractal calculations but aggregates pixel iteration
counts into an observable checksum instead of materializing the complete
result array.

This mode reduces the influence of full result materialization.

It is not treated as a perfectly isolated pure-computation benchmark and
the difference between end-to-end and compute-focused measurements must
not be interpreted directly as JavaScript/WebAssembly transfer overhead.

### `www/js/experiment-suite.js`

Executes the complete collection of experiment scenarios.

Responsibilities include:

-   sequential scenario execution,
-   browser yielding between scenarios,
-   experiment progress reporting,
-   experiment metadata collection,
-   aggregation of scenario results.

Individual benchmark scenarios remain synchronous.

The complete benchmark is intentionally executed on the browser main
thread so that JavaScript, scalar WebAssembly and WebAssembly SIMD are
compared in the same execution context.

### `www/js/validation.js`

Validates correctness between implementations.

The JavaScript implementation is used as the reference output.

The module verifies that scalar WebAssembly and WebAssembly SIMD produce
the same iteration counts for every generated pixel.

Validation is performed outside the timed measurement region.

### `www/js/workload-metrics.js`

Calculates characteristics of the generated fractal workload.

Metrics include:

-   total pixel count,
-   total iteration count,
-   average iterations,
-   iteration standard deviation,
-   minimum and maximum observed iteration counts,
-   escaped pixel count and ratio,
-   iteration-limit-reached count and ratio.

The module additionally calculates SIMD-oriented workload metrics:

-   pair count,
-   pair loop iterations,
-   useful lane iterations,
-   wasted lane iterations,
-   iteration utilization,
-   wasted lane iteration ratio.

These metrics describe algorithmic divergence between paired SIMD lanes
and must not be interpreted as direct physical CPU SIMD utilization.

### `www/js/result-export.js`

Exports complete experiment results.

Supported formats:

-   JSON,
-   CSV.

JSON is treated as the canonical experiment record and preserves:

-   metadata,
-   scenario configuration,
-   correctness validation,
-   workload metrics,
-   raw timing measurements,
-   statistical summaries,
-   speedups,
-   throughput values,
-   checksums.

CSV provides an analysis-oriented representation containing one row for
each:

``` text
scenario × benchmark mode × implementation
```

For the complete experiment this produces:

``` text
22 × 2 × 3 = 132 rows
```

### `www/js/test.js`

Simple early development test for the JavaScript Mandelbrot point
function.

It evaluates several known points and was used during the initial
implementation stage.

It is retained as a small historical development test but is not part of
the final experimental pipeline.

## Generated WebAssembly files

### `www/wasm/scalar/`

Contains the scalar WebAssembly module and JavaScript bindings used by
the browser application.

### `www/wasm/simd/`

Contains the WebAssembly SIMD module and JavaScript bindings used by the
browser application.

These files are generated from the corresponding Rust crates and copied
into the browser application after compilation.

## Logical application flow

The main application flow can be summarized as:

``` text
index.html
    |
    v
main.js
    |
    +----------------------+
    |                      |
    v                      v
Interactive rendering     Experiment suite
    |                      |
    v                      v
fractal-generator.js      experiment-suite.js
    |                      |
    v                      v
JS / WASM / SIMD          experiment-runner.js
                           |
              +------------+-------------+
              |            |             |
              v            v             v
             JS        WASM scalar    WASM SIMD
              \            |             /
               \           |            /
                +----------+-----------+
                           |
                           v
                    validation.js
                           |
                           v
                  workload-metrics.js
                           |
                           v
                     benchmark.js
                           |
                           v
                   result-export.js
                           |
                     +-----+-----+
                     |           |
                     v           v
                    JSON        CSV
```

## Thesis relevance

This project structure supports separation between:

-   algorithm implementation,
-   WebAssembly integration,
-   visualization,
-   correctness validation,
-   benchmark configuration,
-   benchmark execution,
-   statistical processing,
-   result export.

This separation makes it possible to describe the implementation and
experimental methodology independently in the thesis.

The simplified repository structure and logical flow may be reused when
preparing:

-   the implementation chapter,
-   the architecture description,
-   an architecture diagram,
-   the methodology chapter.