# Environment Setup

This document describes the hardware, software environment, development
toolchain, WebAssembly build configuration, and benchmark procedure used in
the project.

The environment information is also used to document the conditions under
which the final performance measurements are performed.

## Hardware

- CPU: Intel(R) Core(TM) i7-7700 CPU @ 3.60 GHz
- RAM: 16 GB

## Operating System

- Windows 10
- Version: 22H2
- Build: 19045.6456

## Browser

Final benchmark environment verified on: 27.09.2026

- Google Chrome: 152.0.7977.84 (64-bit)
- JavaScript engine: V8 15.2.124.21
- Browser user agent: `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36`

The browser user agent exposes the major Chrome version as `152.0.0.0`,
while `chrome://version` reports the complete installed browser version
`152.0.7977.84`.

The complete browser and V8 versions were recorded immediately before the
final benchmark experiment.

## Development Toolchain

Versions verified before the final benchmark on: 27.09.2026

- rustc: 1.97.0 (2d8144b78 2026-07-07)
- cargo: 1.97.0 (c980f4866 2026-06-30)
- wasm-pack: 0.15.0
- Node.js: v20.12.2
- Python: 3.12.3
- Git: 2.48.1.windows.1
- Rust WebAssembly target: `wasm32-unknown-unknown`

## Environment Installation

### 1. Install Rust

Rust was installed using `rustup`.

On Windows, Visual Studio C++ Build Tools may also be required by parts of
the Rust toolchain.

After installation, the Rust installation can be verified with:

```powershell
rustc --version
cargo --version
```

### 2. Add the WebAssembly Target

The WebAssembly compilation target was added with:

```powershell
rustup target add wasm32-unknown-unknown
```

### 3. Install wasm-pack

`wasm-pack` was installed using Cargo:

```powershell
cargo install wasm-pack
```

The installation can be verified with:

```powershell
wasm-pack --version
```

### 4. Install Node.js

Node.js was installed using the LTS version available from the official
Node.js website.

The installation can be verified with:

```powershell
node --version
```

### 5. Install Git

Git was installed using the standard Windows installer.

The installation can be verified with:

```powershell
git --version
```

### 6. Clone the Repository

The project repository can be cloned with:

```powershell
git clone https://github.com/123Mikolaj/fractal-wasm-benchmark.git
cd fractal-wasm-benchmark
```

## Project Initialization

### JavaScript Implementation

The browser application is located in the `www` directory.

The JavaScript implementation separates fractal computation, rendering,
benchmark execution, validation, and result export into separate modules.

The main JavaScript fractal implementations are:

```text
www/js/
├── mandelbrot.js
└── julia.js
```

The JavaScript implementation serves as the reference implementation for
the WebAssembly variants.

### Scalar WebAssembly Implementation

The scalar Rust implementation is located in:

```text
rust/mandelbrot-scalar/
```

The project was initialized as a Rust library using:

```powershell
cd rust
cargo init mandelbrot-scalar --lib
```

The library is configured in `Cargo.toml` to produce a WebAssembly-compatible
library and uses `wasm-bindgen` to expose Rust functions to JavaScript.

The scalar implementation contains both Mandelbrot and Julia fractal
calculations. The historical `mandelbrot-scalar` directory name was retained
after Julia support was introduced.

## Local Development Server

The browser application can be served locally from the `www` directory using
Python:

```powershell
cd www
python -m http.server 8080
```

The application is then available at:

```text
http://localhost:8080
```

A local HTTP server is used instead of opening `index.html` directly because
the application uses JavaScript ES modules and loads WebAssembly modules.

## WebAssembly Build Configuration

### Scalar WebAssembly

The scalar Rust implementation is compiled for the browser using:

```powershell
cd rust/mandelbrot-scalar
Remove-Item Env:RUSTFLAGS -ErrorAction SilentlyContinue
wasm-pack build --target web
```

Removing `RUSTFLAGS` before the scalar build ensures that the SIMD target
feature used by the SIMD implementation is not accidentally inherited by the
scalar build.

The build uses the optimized Rust `release` profile.

During the build process, `wasm-pack` also invokes `wasm-opt` to optimize the
generated WebAssembly binary.

The generated package is placed in:

```text
rust/mandelbrot-scalar/pkg/
```

The generated JavaScript bindings and WebAssembly binary used by the browser
application are copied to:

```text
www/wasm/scalar/
```

Immediately before the final experiment the scalar implementation was rebuilt
and the newly generated files were copied to the browser application.

## SIMD Configuration

The WebAssembly SIMD implementation is located in:

```text
rust/mandelbrot-simd/
```

Like the scalar crate, the SIMD crate contains implementations of both the
Mandelbrot and Julia fractals. The historical `mandelbrot-simd` directory name
was retained after Julia support was introduced.

The implementation is compiled for the `wasm32-unknown-unknown` target with
the WebAssembly SIMD128 target feature enabled:

```powershell
cd rust/mandelbrot-simd
$env:RUSTFLAGS="-C target-feature=+simd128"
wasm-pack build --target web
```

The SIMD implementation uses WebAssembly SIMD128 operations and processes
pairs of double-precision floating-point values using `f64x2` vectors.

The generated JavaScript bindings and WebAssembly binary used by the browser
application are copied to:

```text
www/wasm/simd/
```

Immediately before the final experiment the SIMD implementation was rebuilt
using the release profile and `wasm-opt` optimization.

## Benchmark Environment and Procedure

The final benchmark protocol was frozen before collecting the thesis dataset.

### Compared Implementations

The experiment compares three implementations:

- JavaScript,
- scalar WebAssembly,
- WebAssembly SIMD.

All implementations execute in the same browser environment and use equivalent
fractal algorithms and numerical parameters.

The benchmark is executed on the browser main thread. Web Workers and
multithreaded execution are outside the scope of the primary experiment.

### Experimental Scenarios

The final experiment suite contains 22 scenarios.

The primary Mandelbrot and Julia scenarios use combinations of:

- resolutions: `800x600`, `1280x720`, and `1920x1080`,
- maximum iteration limits: `250`, `500`, and `1000`.

This produces:

- 9 standard Mandelbrot scenarios,
- 9 standard Julia scenarios.

Four additional workload-oriented scenarios are included:

- Mandelbrot interior region,
- Mandelbrot boundary region,
- Julia parameter preset B,
- Julia parameter preset C.

The workload-oriented scenarios use:

- resolution: `1280x720`,
- maximum iteration limit: `1000`.

### Measurement Procedure

For every scenario, correctness is validated before benchmark measurements are
interpreted.

The final benchmark configuration uses:

- 5 warm-up runs,
- 30 measured runs,
- deterministic balanced implementation rotation,
- synchronous execution of individual measured functions,
- browser yielding only between complete benchmark scenarios.

The implementation order is rotated between repetitions to reduce systematic
bias caused by always measuring implementations in the same order.

Correctness validation is performed outside the timed benchmark region.

### Benchmark Modes

Two benchmark modes are recorded.

#### endToEnd

The `endToEnd` benchmark measures complete fractal result generation,
including creation and materialization of the full result that becomes
available to JavaScript.

Canvas rendering is excluded from the measurement.

This mode represents the primary application-oriented performance comparison.

#### computeFocused

The `computeFocused` benchmark performs the same fractal calculation while
reducing full output materialization. Instead of returning the complete array
of iteration values, iteration counts are aggregated into an observable
checksum.

The checksum is validated against the workload information and between all
three implementations.

This mode is treated as a secondary diagnostic compute-focused measurement.

It must not be interpreted as a perfectly isolated measurement of pure
computation or JavaScript/WebAssembly transfer overhead.

In particular, the difference between `endToEnd` and `computeFocused`
execution times must not be interpreted directly as transfer cost.

## Correctness Validation

Before performance results are interpreted, the output of the implementations
is compared.

For full-output generation:

- JavaScript serves as the reference implementation,
- scalar WebAssembly output is compared element-by-element with JavaScript,
- WebAssembly SIMD output is compared element-by-element with JavaScript.

The complete 22-scenario technical pilot produced zero differences between
the implementations.

For the compute-focused benchmark:

- JavaScript,
- scalar WebAssembly,
- WebAssembly SIMD

must produce identical checksums.

The checksum must also match the total useful iteration count calculated from
the validated workload.

## Recorded Statistics

Raw execution times are measured using the browser High Resolution Time API
through `performance.now()`.

For every implementation and benchmark mode the experiment records:

- raw timing observations,
- mean execution time,
- median execution time,
- minimum execution time,
- maximum execution time,
- sample standard deviation,
- coefficient of variation,
- megapixels per second (MPixels/s),
- million useful fractal iterations per second (MIterations/s),
- speedup relative to JavaScript,
- WebAssembly SIMD speedup relative to scalar WebAssembly.

`MIterations/s` represents useful scalar-equivalent fractal iterations
processed per second. It does not represent physical processor instructions
or SIMD lane operations.

Additional workload characteristics are recorded to support interpretation of
performance results.

SIMD workload utilization metrics describe algorithmic divergence between
paired lanes. They must not be interpreted as direct measurements of physical
CPU SIMD utilization.

## Result Preservation

The complete experiment result is exported in two formats.

### JSON

JSON is treated as the canonical experiment record.

It contains:

- experiment metadata,
- complete scenario definitions,
- correctness validation,
- workload metrics,
- raw timing observations,
- calculated statistics,
- checksums,
- throughput values,
- speedups.

Preserving raw timing observations allows statistical analysis to be repeated
without rerunning the complete benchmark.

### CSV

CSV is an analysis-oriented tabular representation derived from the same
experiment object.

It contains one row for each:

```text
scenario × benchmark mode × implementation
```

For the complete experiment this produces:

```text
22 scenarios × 2 benchmark modes × 3 implementations = 132 rows
```

The CSV contains scenario parameters, benchmark statistics, speedups,
throughput values, and workload characteristics.

Raw timing samples remain preserved in the JSON output.

## Final Technical Validation

Before collecting the final thesis dataset, the complete 22-scenario
experimental pipeline was executed using reduced development settings:

- 1 warm-up run,
- 2 measured runs.

This technical pilot verified that all scenarios could be executed from
beginning to end.

For all 22 scenarios:

- JavaScript vs scalar WebAssembly output differences were zero,
- JavaScript vs WebAssembly SIMD output differences were zero,
- compute-focused checksums were identical between implementations,
- checksums matched the workload iteration totals,
- both benchmark modes completed,
- statistics were generated,
- speedups were generated,
- throughput metrics were generated,
- JSON export completed,
- CSV export completed.

The reduced `1/2` configuration was used only to validate the complete
experimental pipeline.

Measurements from this pilot are not used as the final thesis dataset.

The final thesis measurements use the frozen `5/30` configuration described
above.