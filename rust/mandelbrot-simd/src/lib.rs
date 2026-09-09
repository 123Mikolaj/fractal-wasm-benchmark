use wasm_bindgen::prelude::*;
use std::arch::wasm32::*;

#[wasm_bindgen]
pub fn generate_mandelbrot_simd(
    width: u32,
    height: u32,
    max_iterations: u32,
    min_real: f64,
    max_real: f64,
    min_imaginary: f64,
    max_imaginary: f64,
) -> Vec<u32> {

    let mut result = vec![0; (width * height) as usize];

    for y in 0..height {
        let imaginary = 
            min_imaginary 
            + (y as f64 / (height - 1) as f64) 
            * (max_imaginary - min_imaginary);

        let mut x = 0;

        while x + 1 < width {
            let real_0 =
                min_real
                + (x as f64 / (width - 1) as f64)
                * (max_real - min_real);

            let real_1 =
                min_real
                + ((x + 1) as f64 / (width - 1) as f64)
                * (max_real - min_real);

            let c_real = f64x2(real_0, real_1);
            let c_imaginary = f64x2_splat(imaginary);

            let mut z_real = f64x2_splat(0.0);
            let mut z_imaginary = f64x2_splat(0.0);

            let mut iterations = [0u32; 2];
            let mut active = [true; 2];

            for _ in 0..max_iterations {
                let z_real_squared = f64x2_mul(z_real, z_real);
                let z_imaginary_squared = f64x2_mul(z_imaginary, z_imaginary);

                let new_real =
                    f64x2_add(
                        f64x2_sub(z_real_squared, z_imaginary_squared),
                        c_real,
                    );

                let new_imaginary =
                    f64x2_add(
                        f64x2_mul(
                            f64x2_splat(2.0),
                            f64x2_mul(z_real, z_imaginary),
                        ),
                        c_imaginary,
                    );

                z_real = new_real;
                z_imaginary = new_imaginary;

                let magnitudes = f64x2_add(
                    f64x2_mul(z_real, z_real),
                    f64x2_mul(z_imaginary, z_imaginary),
                );

                let lanes = [
                    f64x2_extract_lane::<0>(magnitudes),
                    f64x2_extract_lane::<1>(magnitudes),
                ];

                for lane in 0..2 {
                    if active[lane] {
                        iterations[lane] += 1;

                        if lanes[lane] > 4.0 {
                            active[lane] = false;
                        }
                    }
                }

                if !active[0] && !active[1] {
                    break;
                }
            }

            let index = (y * width + x) as usize;

            result[index] = iterations[0];
            result[index + 1] = iterations[1];

            x += 2;
        }

        if x < width {
            let real =
                min_real
                + (x as f64 / (width - 1) as f64)
                * (max_real - min_real);

            let mut z_real = 0.0;
            let mut z_imaginary = 0.0;
            let mut iteration = 0;

            while iteration < max_iterations {
                let new_real =
                    z_real * z_real - z_imaginary * z_imaginary + real;

                let new_imaginary =
                    2.0 * z_real * z_imaginary + imaginary;

                z_real = new_real;
                z_imaginary = new_imaginary;

                iteration += 1;

                if z_real * z_real + z_imaginary * z_imaginary > 4.0 {
                    break;
                }
            }

            result[(y * width + x) as usize] = iteration;
        }
    }

    result
}

#[wasm_bindgen]
pub fn generate_julia_simd(
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

    let mut result = vec![0; (width * height) as usize];

    for y in 0..height {
        let imaginary =
            min_imaginary
            + (y as f64 / (height - 1) as f64)
            * (max_imaginary - min_imaginary);

        let mut x = 0;

        while x + 1 < width {
            let real_0 =
            min_real
            + (x as f64 / (width - 1) as f64)
            * (max_real - min_real);

            let real_1 =
                min_real
                + ((x + 1) as f64 / (width - 1) as f64)
                * (max_real - min_real);

            let mut z_real = f64x2(real_0, real_1);
            let mut z_imaginary = f64x2_splat(imaginary);

            let c_real_vector = f64x2_splat(c_real);
            let c_imaginary_vector = f64x2_splat(c_imaginary);

            let mut iterations = [0u32; 2];
            let mut active = [true; 2];

            for _ in 0..max_iterations {
                let z_real_squared =
                    f64x2_mul(z_real, z_real);

                let z_imaginary_squared =
                    f64x2_mul(z_imaginary, z_imaginary);

                let new_real =
                    f64x2_add(
                        f64x2_sub(
                            z_real_squared,
                            z_imaginary_squared,
                        ),
                        c_real_vector,
                    );

                let new_imaginary =
                    f64x2_add(
                        f64x2_mul(
                            f64x2_splat(2.0),
                            f64x2_mul(
                                z_real,
                                z_imaginary,
                            ),
                        ),
                        c_imaginary_vector,
                    );

                z_real = new_real;
                z_imaginary = new_imaginary;

                let magnitudes =
                    f64x2_add(
                        f64x2_mul(z_real, z_real),
                        f64x2_mul(
                            z_imaginary,
                            z_imaginary,
                        ),
                    );

                let lanes = [
                    f64x2_extract_lane::<0>(magnitudes),
                    f64x2_extract_lane::<1>(magnitudes),
                ];

                for lane in 0..2 {
                    if active[lane] {
                        iterations[lane] += 1;

                        if lanes[lane] > 4.0 {
                            active[lane] = false;
                        }
                    }
                }

                if !active[0] && !active[1] {
                    break;
                }
            }

            let index = (y * width + x) as usize;

            result[index] = iterations[0];
            result[index + 1] = iterations[1];

            x += 2;
        }

        if x < width {
            let real =
                min_real
                + (x as f64 / (width - 1) as f64)
                * (max_real - min_real);

            let mut z_real = real;
            let mut z_imaginary = imaginary;
            let mut iteration = 0;

            while iteration < max_iterations {
                let new_real =
                    z_real * z_real
                    - z_imaginary * z_imaginary
                    + c_real;

                let new_imaginary =
                    2.0 * z_real * z_imaginary
                    + c_imaginary;

                z_real = new_real;
                z_imaginary = new_imaginary;

                iteration += 1;

                if z_real * z_real
                    + z_imaginary * z_imaginary
                    > 4.0 
                {
                    break;
                }
            }

            result[(y * width + x) as usize] =
                iteration;
        }
    }

    result
}