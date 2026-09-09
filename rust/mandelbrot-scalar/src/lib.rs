use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn mandelbrot_point(
    real: f64,
    imaginary: f64,
    max_iterations: u32,
) -> u32 {
    let mut z_real = 0.0;
    let mut z_imaginary = 0.0;
    let mut iteration = 0;

    while iteration < max_iterations {
        let new_real = z_real * z_real - z_imaginary * z_imaginary + real;
        let new_imaginary = 2.0 * z_real * z_imaginary + imaginary;

        z_real = new_real;
        z_imaginary = new_imaginary;

        iteration += 1;

        if z_real * z_real + z_imaginary * z_imaginary > 4.0 {
            break;
        }
    }

    iteration
}

#[wasm_bindgen]
pub fn generate_mandelbrot(
    width: u32,
    height: u32,
    max_iterations: u32,
    min_real: f64,
    max_real: f64,
    min_imaginary: f64,
    max_imaginary: f64,
) -> Vec<u32> {

    let mut result = Vec::with_capacity((width * height) as usize);

    for y in 0..height {
        for x in 0..width {
            let real = min_real + (x as f64 / (width - 1) as f64) * (max_real - min_real);

            let imaginary = min_imaginary + (y as f64 / (height - 1) as f64) * (max_imaginary - min_imaginary);

            let iterations = mandelbrot_point(real, imaginary, max_iterations);

            result.push(iterations);
        }
    }

    result
}

#[wasm_bindgen]
pub fn julia_point(
    real: f64,
    imaginary: f64,
    c_real: f64,
    c_imaginary: f64,
    max_iterations: u32,
) -> u32 {
    let mut z_real = real;
    let mut z_imaginary = imaginary;
    let mut iteration = 0;

    while iteration < max_iterations {
        let new_real =
            z_real * z_real - z_imaginary * z_imaginary + c_real;

        let new_imaginary =
            2.0 * z_real * z_imaginary + c_imaginary;

        z_real = new_real;
        z_imaginary = new_imaginary;

        iteration += 1;

        if z_real * z_real + z_imaginary * z_imaginary > 4.0 {
            break;
        }
    }

    iteration
}

#[wasm_bindgen]
pub fn generate_julia(
    width: u32,
    height: u32,
    max_iterations: u32,
    c_real: f64,
    c_imaginary: f64,
    min_real: f64,
    max_real: f64,
    min_imaginary: f64,
    max_imaginary: f64,
) -> Vec<u32> {

    let mut result = Vec::with_capacity((width * height) as usize);

    for y in 0..height {
        for x in 0..width {
            let real =
                min_real
                + (x as f64 / (width - 1) as f64)
                * (max_real - min_real);

            let imaginary =
                min_imaginary
                + (y as f64 / (height - 1) as f64)
                * (max_imaginary - min_imaginary);

            let iterations = julia_point(
                real,
                imaginary,
                c_real,
                c_imaginary,
                max_iterations,
            );

            result.push(iterations);
        }
    }

    result
}