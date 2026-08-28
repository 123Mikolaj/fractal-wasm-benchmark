# Development Log

## 26.08.2026 – JavaScript implementation

Implemented the initial Mandelbrot algorithm in JavaScript.

The implementation consists of:
- calculation of the iteration count for a single complex point,
- generation of iteration values for the complete image,
- mapping canvas pixels to the complex plane,
- rendering the generated iteration data using the HTML Canvas API.

The computational part was separated from the rendering logic so that rendering time can be excluded from computational benchmarks.

Initial correctness tests were performed for selected points of the Mandelbrot set using a maximum iteration count of 500:

| Point | Result |
|---|---:|
| c = 0 + 0i | 500 |
| c = -1 + 0i | 500 |
| c = 1 + 0i | 3 |
| c = 2 + 0i | 2 |

The Mandelbrot image was successfully generated and rendered at a resolution of 800 × 600 pixels.

## 26.08.2026 – Scalar WebAssembly implementation

Created a Rust library for the scalar WebAssembly implementation using `wasm-bindgen`.

The Rust implementation uses `f64` values for Mandelbrot calculations to maintain numerical consistency with JavaScript's `Number` type.

The module was compiled to WebAssembly using:

`wasm-pack build --target web`

The generated WebAssembly module was successfully loaded and executed in the browser.

The same characteristic points used for the JavaScript implementation were tested:

| Point | Result |
|---|---:|
| c = 0 + 0i | 500 |
| c = -1 + 0i | 500 |
| c = 1 + 0i | 3 |
| c = 2 + 0i | 2 |

The results matched the JavaScript implementation.

## 28.08.2026 – Full JavaScript/WebAssembly validation

Implemented full-image Mandelbrot generation in the scalar WebAssembly module.

The JavaScript and WebAssembly implementations were executed using identical parameters:

- Resolution: 800 × 600
- Number of pixels: 480,000
- Maximum iterations: 500
- Real axis range: [-2.5, 1.0]
- Imaginary axis range: [-1.2, 1.2]

The iteration count produced for every pixel by the JavaScript implementation was compared with the corresponding value produced by the scalar WebAssembly implementation.

Validation result:

- JavaScript output length: 480,000
- WebAssembly output length: 480,000
- Number of differing values: 0

Therefore, both implementations produced identical iteration data for all 480,000 pixels in the tested configuration.

The image generated using the WebAssembly result was also successfully rendered using the common Canvas renderer.