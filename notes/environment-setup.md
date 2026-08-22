# Environment Setup

## Hardware
- CPU: Intel(R) Core(TM) i7-7700 CPU @ 3.60GHz
- RAM: 16GB

## Operating System
Windows 10, version 22H2, Build 19045.6456

## Browser
- Google Chrome 151.0.7922.172 (64-bit)
- JS engine: V8 15.1.206.21

## Toolchain verisions
Checked on: 22.08.2026

- rustc 1.97.0 (2d8144b78 2026-07-07)
- cargo 1.97.0 (c980f4866 2026-06-30)
- wasm-pack 0.15.0
- node v20.12.2
- target: wasm32-unknown-unknown

## Installation steps

1. Install Rust via rustup:
- Download 'rustup-init.exe' from https://rustup.rs and run it
- When prompted, accept installation of Visual Studio C++ Build Tools (required on Windows even for WASM targets, since some build tooling still compiles for the host)
- Restart terminal after installation to refresh PATH

2. Add the WebAssembly compilation target:
```powershell
   rustup target add wasm32-unknown-unknown
```

3. Install wasm-pack (compiles from source, may take a few minutes):
```powershell
   cargo install wasm-pack
```

4. Install Node.js:
- Download LTS version from https://nodejs.org, run installer
- Restart terminal, verify with 'node --version'

5. Install Git (if not already present):
- Download from https://git-scm.com, run installer with default options

6. Clone the project repository:
```powershell
   git clone https://github.com/123Mikolaj/fractal-wasm-benchmark.git
```

## Notes