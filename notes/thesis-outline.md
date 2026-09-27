# Thesis outline

Working title:

**Analiza i porównanie wydajności JavaScript, WebAssembly oraz WebAssembly SIMD na przykładzie generowania fraktali w aplikacji webowej**

This outline is a working plan for the master's thesis. It is based on the official UKEN Institute of Security and Computer Science requirements and on the current state of the `fractal-wasm-benchmark` project.

The target length is approximately **30–40 pages of main text**, excluding the title page, abstracts, table of contents, bibliography, lists of figures/tables and appendices.

The thesis should remain focused on the **research problem**. The application is treated as a research tool, not as the main goal of the thesis.

---

## Required front matter

### Title page

Use the official UKEN template without redesigning the layout.

Information to complete:

- university and institute,
- field of study,
- thesis title,
- author,
- supervisor,
- place and year.

### Abstracts

Prepare:

- abstract in Polish,
- abstract in English,
- keywords in Polish,
- keywords in English.

Recommended length: approximately 150–250 words per abstract.

The abstracts should briefly state:

- the research problem,
- the aim of the thesis,
- the compared technologies,
- the experimental method,
- the most important result,
- the main conclusion.

Write these near the end, after the final results and conclusions are known.

### Table of contents

Generated automatically by LaTeX.

### Lists of figures and tables

Include if the final thesis contains a meaningful number of figures/tables.

---

# 1. Wstęp

Target length: **2–3 pages**

The introduction should establish the research problem and explain why the comparison is worth performing.

## 1.1. Kontekst i motywacja

Describe:

- increasing use of computation-heavy logic in web applications,
- JavaScript as the traditional execution environment in browsers,
- WebAssembly as an alternative execution format for performance-sensitive code,
- SIMD as a method of processing multiple values in parallel,
- why fractal generation is a useful numerical workload for this comparison.

Do not present benchmark results here.

Sources needed:

- WebAssembly specification or official documentation,
- source on JavaScript execution/JIT in modern browsers,
- source on SIMD/WebAssembly SIMD,
- source on Mandelbrot/Julia computation.

## 1.2. Problem badawczy

Working research problem:

**W jaki sposób zastosowanie WebAssembly oraz WebAssembly SIMD wpływa na wydajność generowania fraktali w przeglądarce internetowej w porównaniu z implementacją JavaScript oraz jak wpływ ten zmienia się wraz z charakterystyką obciążenia obliczeniowego?**

This problem should remain the central thread of the thesis.

## 1.3. Cel pracy

Working main objective:

**Celem pracy jest eksperymentalna analiza i porównanie wydajności implementacji JavaScript, WebAssembly oraz WebAssembly SIMD na przykładzie generowania zbiorów Mandelbrota i Julii w aplikacji webowej.**

Supporting objectives:

- prepare functionally equivalent implementations,
- verify correctness between implementations,
- design a reproducible benchmark procedure,
- measure execution times under multiple workloads,
- calculate relative speedups and throughput,
- investigate how resolution, iteration limit and workload characteristics affect relative performance,
- assess the influence of SIMD lane divergence on observed SIMD efficiency.

The application itself is not the main objective; it is the experimental platform used to answer the research problem.

## 1.4. Pytania badawcze

Proposed research questions:

**RQ1.** Jak zmienia się wydajność generowania fraktali pomiędzy JavaScript, skalarnym WebAssembly i WebAssembly SIMD?

**RQ2.** Czy WebAssembly SIMD zapewnia dodatkowe przyspieszenie względem skalarnego WebAssembly i jak duża jest ta korzyść w różnych scenariuszach?

**RQ3.** Jak rozdzielczość obrazu i maksymalna liczba iteracji wpływają na względną wydajność badanych implementacji?

**RQ4.** Jak charakterystyka obciążenia obliczeniowego, w tym rozbieżność pracy par SIMD, wpływa na uzyskiwane przyspieszenie?

**RQ5.** Jak różnią się wyniki pełnego generowania wyniku (`endToEnd`) od pomocniczego benchmarku `computeFocused`?

## 1.5. Hipotezy badawcze

Treat these as working hypotheses to be verified using the final measurements.

**H1.** WebAssembly SIMD osiąga krótszy czas wykonania niż skalarne WebAssembly w obliczeniach generowania fraktali.

**H2.** Wielkość przyspieszenia WebAssembly SIMD zależy od charakterystyki obciążenia, w szczególności od rozbieżności liczby iteracji pomiędzy elementami przetwarzanymi w parze SIMD.

**H3.** Względna wydajność JavaScript i skalarnego WebAssembly nie jest stała i zależy od parametrów scenariusza oraz sposobu materializacji wyniku.

Do not rewrite the hypotheses after seeing the results merely to make them true. The results may confirm, partially confirm or reject them.

## 1.6. Zakres pracy

Include:

- CPU-only execution,
- browser environment,
- JavaScript,
- scalar WebAssembly generated from Rust,
- WebAssembly SIMD using `simd128`,
- Mandelbrot and Julia sets,
- three resolutions,
- three maximum-iteration limits,
- additional workload-specific scenarios,
- main-thread execution,
- no WebGPU,
- no multithreaded Web Workers,
- Canvas rendering excluded from scientific benchmark timing.

## 1.7. Struktura pracy

Briefly describe what each subsequent chapter contains.

---

# 2. Podstawy teoretyczne

Target length: **6–8 pages**

This chapter should be a concise literature-based foundation for the experiment. Avoid turning it into a general history of web development.

## 2.1. JavaScript jako środowisko obliczeniowe w przeglądarce

Cover:

- JavaScript execution in modern browsers,
- dynamic typing,
- JIT compilation at a high level,
- optimization of numerical loops,
- why JavaScript may perform well in computation-heavy tasks.

Avoid unsupported claims about exact V8 behavior unless supported by a source.

Sources needed:

- official V8 documentation or technical publications,
- academic or authoritative sources on JavaScript/JIT performance.

## 2.2. WebAssembly

Cover:

- purpose of WebAssembly,
- binary instruction format,
- execution inside the browser,
- linear memory,
- interaction with JavaScript,
- Rust-to-Wasm compilation in this project,
- role of `wasm-bindgen`.

Important thesis nuance:

Returned numeric arrays exposed to JavaScript involve materialization/copying behavior that must be described from authoritative `wasm-bindgen` documentation.

Sources needed:

- WebAssembly Core Specification,
- official WebAssembly documentation,
- `wasm-bindgen` documentation,
- peer-reviewed WebAssembly performance studies.

## 2.3. SIMD i WebAssembly SIMD

Cover:

- concept of SIMD,
- lane-based vector processing,
- `v128`,
- `f64x2`,
- two double-precision lanes,
- potential benefit when the same operation is applied to multiple values,
- divergence/unequal loop lengths as a limitation for this workload.

Sources needed:

- WebAssembly SIMD specification/documentation,
- Rust `std::arch::wasm32` documentation,
- technical or academic SIMD references.

## 2.4. Zbiory Mandelbrota i Julii

Cover:

- recurrence \(z_{n+1} = z_n^2 + c\),
- escape-time algorithm,
- role of maximum iteration count,
- Mandelbrot parameterization,
- Julia parameterization,
- why pixels are independent and suitable for data-parallel computation,
- why iteration counts differ across pixels.

Sources needed:

- reliable mathematical/fractal literature.

## 2.5. Generowanie fraktali jako obciążenie benchmarkowe

Explain why the workload is useful:

- large number of independent pixels,
- repeated floating-point arithmetic,
- variable iteration count,
- controllable workload size,
- easy correctness comparison between implementations,
- natural relevance to SIMD divergence.

This subsection links theory directly to the experimental design.

---

# 3. Projekt i implementacja aplikacji badawczej

Target length: **6–7 pages**

Primary project notes:

- `notes/project-structure.md`
- `notes/development-log.md`
- `notes/environment-setup.md`

The purpose of this chapter is not to document every line of code. It should explain the architecture and the implementation decisions that matter for the experiment.

## 3.1. Założenia projektowe

Describe:

- equivalent algorithms across all implementations,
- common numerical precision (`f64` / JavaScript `Number`),
- same coordinate mapping,
- same iteration limit,
- CPU-only execution,
- rendering separated from measured computation,
- correctness before performance.

## 3.2. Architektura aplikacji

Use the simplified architecture from `notes/project-structure.md`.

Suggested figure:

**Rysunek 3.1. Architektura aplikacji badawczej**

Possible flow:

`UI -> experiment suite -> runner -> JS / WASM scalar / WASM SIMD -> validation -> metrics -> JSON/CSV`

Explain the roles of:

- `main.js`,
- `experiment-suite.js`,
- `experiment-runner.js`,
- `benchmark.js`,
- `validation.js`,
- `workload-metrics.js`,
- `result-export.js`.

## 3.3. Implementacja JavaScript

Describe:

- Mandelbrot generator,
- Julia generator,
- per-pixel iteration count,
- full-output functions,
- checksum compute-focused functions.

Use only small code fragments if they genuinely help explain an implementation detail.

## 3.4. Implementacja WebAssembly scalar

Describe:

- Rust implementation,
- compilation through `wasm-pack`,
- `wasm32-unknown-unknown`,
- exported functions through `wasm-bindgen`,
- generated JS bindings and `.wasm`,
- same algorithm and `f64` precision as JavaScript.

Mention the historical crate name `mandelbrot-scalar` only if useful; it contains both Mandelbrot and Julia implementations.

## 3.5. Implementacja WebAssembly SIMD

Describe:

- use of `simd128`,
- `f64x2`,
- processing pixels in pairs,
- active-lane handling,
- fallback for an odd remaining pixel if applicable,
- same mathematical result as scalar versions.

Suggested small diagram:

**Rysunek 3.2. Przetwarzanie dwóch pikseli w parze SIMD**

## 3.6. Wizualizacja i interfejs

Briefly describe:

- fractal selection,
- implementation selection,
- resolution,
- iteration limit,
- Julia parameters,
- Canvas rendering,
- benchmark execution controls,
- JSON/CSV export.

Emphasize that interactive render time is not used as experimental benchmark data.

## 3.7. Walidacja zgodności implementacji

Describe:

- JavaScript used as reference output,
- element-by-element comparison,
- scalar differences count,
- SIMD differences count,
- checksum validation in compute-focused mode,
- validation performed outside timed regions.

This subsection is important because performance comparison is meaningful only after confirming functional equivalence.

---

# 4. Metodyka badań

Target length: **5–7 pages**

This is one of the most important chapters.

Primary project sources:

- `notes/development-log.md`
- `notes/environment-setup.md`
- `notes/thesis-sources.md`
- final JSON metadata
- benchmark source code

## 4.1. Środowisko badawcze

Record the exact final environment used for measurements:

- CPU,
- RAM,
- operating system and build,
- browser and version,
- V8 version if available,
- Rust version,
- Cargo version,
- wasm-pack version,
- WebAssembly target,
- build mode,
- SIMD compilation flag,
- local HTTP server,
- power conditions,
- whether DevTools were closed,
- relevant background-load controls.

Do not rely on old environment notes if the final benchmark environment differs. Use the exact environment from the final experiment session.

## 4.2. Konfiguracja scenariuszy

Describe the 22 scenarios.

### Main factorial scenarios

For Mandelbrot:

- 800×600, 1280×720, 1920×1080,
- max iterations: 250, 500, 1000.

For Julia:

- the same resolutions,
- the same iteration limits,
- fixed default Julia parameters.

This gives:

- 9 Mandelbrot scenarios,
- 9 Julia scenarios.

### Workload-specific scenarios

Mandelbrot:

- interior region,
- boundary region.

Julia:

- preset B,
- preset C.

Use a table summarizing the scenarios rather than listing every identifier in prose.

Suggested table:

**Tabela 4.1. Konfiguracja scenariuszy eksperymentalnych**

## 4.3. Tryby benchmarku

### Full-output / `endToEnd`

Define precisely:

- includes fractal computation,
- includes creation/materialization of the complete result exposed to JavaScript,
- excludes Canvas rendering.

Avoid describing this as complete application response time.

### `computeFocused`

Define precisely:

- performs the same fractal calculation,
- aggregates iteration counts into a checksum,
- avoids materializing the full output array,
- checksum remains externally observable.

Important limitation:

This is a compute-focused diagnostic benchmark, not perfectly isolated pure computation.

Do **not** claim:

`endToEnd - computeFocused = transfer overhead`.

## 4.4. Procedura pomiarowa

Final protocol:

- correctness validation before timing,
- 5 warm-up runs,
- 30 measured runs,
- three implementations,
- deterministic balanced rotation of implementation order,
- synchronous execution within each scenario,
- browser yield only between scenarios,
- main-thread execution,
- raw samples stored in JSON.

Explain why warm-up and interleaving are used using benchmark-methodology sources.

Potential sources:

- Georges, Buytaert & Eeckhout,
- Kalibera & Jones,
- Barrett et al.,
- Google Benchmark interleaving documentation as supplementary technical evidence.

## 4.5. Pomiar czasu

Describe:

- `performance.now()`,
- High Resolution Time API,
- milliseconds,
- measured boundary around the generator function.

Sources:

- W3C High Resolution Time,
- MDN `performance.now()` as supplementary documentation.

## 4.6. Metryki statystyczne

For timing samples:

- mean,
- median,
- minimum,
- maximum,
- sample standard deviation \(N-1\),
- coefficient of variation.

Derived comparison metrics:

- speedup relative to JavaScript,
- SIMD vs scalar speedup.

Throughput:

- MPixels/s,
- MIterations/s.

Important interpretation:

`MIterations/s` means useful scalar-equivalent fractal iterations per second, not CPU instruction throughput.

## 4.7. Charakterystyka workloadu i metryki SIMD

Describe:

- total pixels,
- total iterations,
- average iterations,
- iteration standard deviation,
- escaped ratio,
- iteration-limit-reached ratio.

SIMD-oriented metrics:

- pair count,
- pair loop iterations,
- useful lane iterations,
- wasted lane iterations,
- iteration utilization,
- wasted-lane ratio.

State clearly:

These are algorithmic workload metrics and proxies for lane divergence, not physical CPU utilization measurements.

## 4.8. Wiarygodność i ograniczenia metody

Discuss before presenting results:

- one hardware/browser environment limits generalization,
- main-thread execution may be influenced by operating-system/browser noise,
- JavaScript engine JIT behavior is implementation-specific,
- `computeFocused` changes memory behavior and cannot isolate transfer cost perfectly,
- full-output Wasm return path includes result exposure/materialization,
- SIMD workload metric is algorithmic rather than hardware-counter-based,
- experiment does not test Web Workers, multithreading or GPU execution.

This section strengthens the thesis because limitations are acknowledged explicitly.

---

# 5. Wyniki i dyskusja

Target length: **7–10 pages**

Write this chapter only after the final benchmark dataset has been validated.

Primary data:

- final JSON,
- final CSV,
- analysis scripts/tables/plots generated from the final data.

Do not copy all 132 CSV rows into the thesis. Present selected tables and figures that answer the research questions.

## 5.1. Kontrola jakości danych

Report:

- all scenarios completed,
- correctness validation status,
- checksum validation status,
- number of timing observations,
- distribution/stability indicators such as CV,
- any unusual runs or outliers.

Do not remove outliers ad hoc merely because they are inconvenient.

## 5.2. JavaScript vs WebAssembly scalar

Analyze:

- execution-time differences,
- speedups below/above 1,
- effect of resolution,
- effect of iteration limit,
- Mandelbrot vs Julia,
- full-output vs compute-focused.

If scalar WebAssembly is slower than JavaScript in some or all scenarios, report this directly and investigate plausible explanations using literature rather than treating it as an implementation failure.

Suggested figure:

**Rysunek 5.1. Względna wydajność WebAssembly scalar względem JavaScript**

## 5.3. JavaScript vs WebAssembly SIMD

Analyze:

- SIMD speedup relative to JavaScript,
- dependency on workload size,
- dependency on fractal type,
- cases with little/no advantage.

Suggested figure:

**Rysunek 5.2. Przyspieszenie WebAssembly SIMD względem JavaScript**

## 5.4. WebAssembly SIMD vs WebAssembly scalar

This comparison isolates the practical benefit of explicit SIMD within the Rust/WebAssembly implementations more directly.

Analyze:

- speedup,
- consistency across scenarios,
- sensitivity to workload characteristics.

Suggested figure:

**Rysunek 5.3. Przyspieszenie SIMD względem skalarnego WebAssembly**

## 5.5. Wpływ rozdzielczości i maksymalnej liczby iteracji

Use the 18 main scenarios.

Analyze whether increasing:

- pixel count,
- maximum iteration count,

changes absolute time and relative speedup.

Avoid confusing `maxIterations` with actual performed iterations. Use `totalIterations` where appropriate.

## 5.6. Wpływ charakterystyki obciążenia na SIMD

Use:

- Mandelbrot interior,
- Mandelbrot boundary,
- Julia presets,
- iteration-utilization metrics.

Investigate whether higher/lower lane divergence is associated with changes in SIMD speedup.

Be careful with causal wording. The experiment can demonstrate association in the tested scenarios; it does not prove that the workload metric is the only cause of performance differences.

Suggested figure:

**Rysunek 5.4. Zależność przyspieszenia SIMD od wskaźnika wykorzystania iteracji w parach**

## 5.7. Full-output vs compute-focused

Compare the patterns between both benchmark modes.

Discuss:

- whether relative rankings remain similar,
- whether full result materialization changes observed performance,
- whether some implementations are affected more strongly.

Do not compute or label the simple timing difference as isolated transfer overhead.

## 5.8. Dyskusja wyników

Connect the empirical results to:

- the research questions,
- the hypotheses,
- existing WebAssembly/JavaScript performance literature,
- SIMD expectations,
- browser/runtime characteristics.

Distinguish clearly between:

- measured facts,
- plausible explanations supported by literature,
- hypotheses/speculation that cannot be confirmed with the available experiment.

---

# 6. Zakończenie

Target length: **2–3 pages**

## 6.1. Realizacja celu pracy

State whether the main objective was achieved.

Summarize:

- three equivalent implementations prepared,
- benchmark methodology designed,
- 22 scenarios measured,
- results compared and analyzed.

## 6.2. Odpowiedzi na pytania badawcze

Answer RQ1–RQ5 concisely using final results.

Do not introduce new analyses in the conclusion.

## 6.3. Weryfikacja hipotez

For each hypothesis:

- confirmed,
- partially confirmed,
- rejected,

with one short evidence-based explanation.

## 6.4. Najważniejsze wnioski

Summarize the practically important findings.

Potential themes, depending on final data:

- WebAssembly alone does not guarantee higher browser performance,
- SIMD may provide a measurable benefit,
- workload characteristics matter,
- benchmark scope and result-materialization method affect observed performance.

Only state conclusions supported by the final dataset.

## 6.5. Ograniczenia i dalsze kierunki badań

Possible future work:

- additional hardware,
- additional browsers,
- Web Workers,
- multithreaded Wasm,
- WebGPU/GPU implementations,
- other numerical algorithms,
- deeper profiling with hardware/runtime tooling,
- alternative output-memory strategies.

---

# Bibliografia

Target:

Approximately **20 or more high-quality sources** if possible, while prioritizing relevance and quality over raw count.

Source categories:

- peer-reviewed publications,
- WebAssembly specification,
- WebAssembly SIMD specification/documentation,
- Rust documentation,
- `wasm-bindgen` documentation,
- W3C High Resolution Time,
- benchmark-methodology literature,
- authoritative fractal literature,
- selected official browser/runtime documentation.

A consistent citation style must be used throughout the thesis.

The official template currently uses:

```latex
\bibliographystyle{plabbrv}
```

Do not change the bibliography style without a reason or supervisor requirement.

---

# Spis rysunków i tabel

Potential figures:

1. architecture of the research application,
2. SIMD pair-processing concept,
3. JS vs scalar Wasm speedup chart,
4. JS vs SIMD speedup chart,
5. SIMD vs scalar speedup chart,
6. workload/SIMD-utilization relationship,
7. optional timing distribution/boxplot.

Potential tables:

1. experimental environment,
2. scenario configuration,
3. selected timing results,
4. summary speedups,
5. hypothesis verification summary.

Every figure and table must be referenced explicitly in the main text.

---

# Załączniki

Possible appendices:

## Załącznik A – Repozytorium i uruchomienie aplikacji

Include:

- GitHub repository address,
- required environment,
- build instructions,
- local server instructions.

## Załącznik B – Konfiguracja eksperymentu

Optionally include:

- complete list of scenario identifiers,
- exact benchmark configuration.

## Załącznik C – Dodatkowe wyniki

Only if useful:

- larger result tables that would interrupt the main narrative.

Avoid including large code listings unless they are necessary. The repository is the primary source for complete code.

---

# Mapping to LaTeX files

Recommended mapping for the official modular UKEN template:

```text
szablon_pracy_dyplomowej.tex
abstracts.tex
introduction.tex
chapter01.tex
chapter02.tex
chapter03.tex
chapter04.tex
conclusions.tex
references.bib
```

Suggested contents:

```text
introduction.tex
    -> 1. Wstęp

chapter01.tex
    -> 2. Podstawy teoretyczne

chapter02.tex
    -> 3. Projekt i implementacja aplikacji badawczej

chapter03.tex
    -> 4. Metodyka badań

chapter04.tex
    -> 5. Wyniki i dyskusja

conclusions.tex
    -> 6. Zakończenie
```

The main template will therefore eventually need:

```latex
\include{introduction}
\include{chapter01}
\include{chapter02}
\include{chapter03}
\include{chapter04}
\include{conclusions}
```

Do not make this change until the new chapter files have been created.

---

# Working page budget

| Part | Target |
|---|---:|
| Wstęp | 2–3 pages |
| Podstawy teoretyczne | 6–8 pages |
| Projekt i implementacja | 6–7 pages |
| Metodyka badań | 5–7 pages |
| Wyniki i dyskusja | 7–10 pages |
| Zakończenie | 2–3 pages |
| **Total main text** | **28–38 pages** |

The page counts are planning targets, not strict requirements.

Do not add filler to reach a specific number of pages. The final length should follow from complete coverage of the research problem, method, results and conclusions.

---

# Writing order

Recommended writing order:

1. Chapter 3 – Project and implementation
2. Chapter 4 – Methodology
3. Chapter 2 – Theoretical background
4. Chapter 5 – Results and discussion
5. Chapter 6 – Conclusions
6. Chapter 1 – Introduction
7. Abstracts

The introduction and abstracts are intentionally written late, when the final scope and findings are already known.

---

# Schedule

Current internal schedule:

- **27–28 September** – freeze implementation, final benchmark and dataset validation,
- **29 September–1 October** – project/implementation and theory draft,
- **2–4 October** – methodology and theoretical background,
- **5–6 October** – results, charts and discussion,
- **7 October** – conclusions and complete first draft,
- **8 October** – full revision,
- **9–10 October** – bibliography, formatting, consistency checks and final polishing.

Target:

- first complete draft: **5–7 October**,
- polished version: **7–8 October**,
- internal hard deadline: **10 October**.

