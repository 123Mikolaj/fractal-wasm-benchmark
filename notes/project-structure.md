# Project structure

This document describes the logical structure of the project and the
responsibilities of its main modules.

The project consists of three main parts:

- project documentation,
- Rust/WebAssembly implementations,
- browser application and benchmarking infrastructure.

## Repository structure

```text
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
    │
    ├── css/
    │
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