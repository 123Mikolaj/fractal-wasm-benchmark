# Thesis Sources

This file contains verified sources that may be used in the master's thesis.

For each source, the file records:
- bibliographic information,
- source type,
- DOI or stable URL,
- the claims or methodological decisions it can support,
- the planned place of use in the thesis.

The final bibliography should be generated according to the citation style
required by the university.

---

## Benchmark methodology

### Georges, Buytaert, Eeckhout (2007) — Statistically Rigorous Java Performance Evaluation

Authors:
- Andy Georges
- Dries Buytaert
- Lieven Eeckhout

Publication:
- OOPSLA 2007
- ACM SIGPLAN Notices, Vol. 42, No. 10, pp. 57–76

Type:
- peer-reviewed conference paper

DOI:
- https://doi.org/10.1145/1297027.1297033

Open-access publication record:
- https://biblio.ugent.be/publication/417084

Can support:
- execution time in managed/JIT environments can vary between runs,
- JIT compilation and optimization are sources of runtime variability,
- garbage collection and thread scheduling can affect performance measurements,
- performance evaluation should use repeated measurements and statistical analysis,
- reporting only a single execution time is insufficient for rigorous performance evaluation.

Planned use:
- benchmark methodology,
- justification for repeated measurements,
- discussion of runtime variability,
- interpretation of JavaScript/V8 benchmark results.

Notes:
- The paper concerns Java virtual machines rather than JavaScript/V8 directly.
- It should therefore be used to support general methodological claims about
  benchmarking dynamically optimized/JIT-compiled environments, not claims
  specific to the internal behaviour of V8.

---

### Kalibera, Jones (2013) — Rigorous Benchmarking in Reasonable Time

Authors:
- Tomas Kalibera
- Richard E. Jones

Publication:
- ACM SIGPLAN International Symposium on Memory Management (ISMM 2013)

Type:
- peer-reviewed conference paper

DOI:
- https://doi.org/10.1145/2464157.2464160

Open-access publication record:
- https://kar.kent.ac.uk/33611/

Can support:
- modern software systems introduce non-determinism into performance experiments,
- performance experiments should account for measurement uncertainty,
- benchmark repetitions are necessary for reliable performance evaluation,
- statistical treatment of repeated measurements is preferable to relying on
  individual benchmark executions.

Planned use:
- experimental methodology,
- justification for repeated runs,
- statistical analysis of benchmark results,
- discussion of measurement uncertainty.

---

### Barrett et al. (2017) — Virtual Machine Warmup Blows Hot and Cold

Authors:
- Edd Barrett
- Carl Friedrich Bolz-Tereick
- Rebecca Killick
- Sarah Mount
- Laurence Tratt

Publication:
- Proceedings of the ACM on Programming Languages
- Vol. 1, OOPSLA, Article 52

Type:
- peer-reviewed research article

DOI:
- https://doi.org/10.1145/3133876

Open-access publication record:
- https://kclpure.kcl.ac.uk/portal/en/publications/virtual-machine-warmup-blows-hot-and-cold/

Can support:
- JIT-compiled virtual machines exhibit a warm-up phase,
- measurements collected during warm-up may not represent steady-state performance,
- reaching stable peak performance cannot always be assumed,
- warm-up methodology requires care in performance experiments.

Planned use:
- justification for benchmark warm-up runs,
- limitations of the experimental methodology,
- discussion of JIT behaviour.

Notes:
- The study covers several virtual machines and does not specifically establish
  the required number of warm-up runs for V8.
- It must not be used as evidence that exactly five warm-up runs are sufficient
  in this project.

---

### Google Benchmark — Random Interleaving

Organization:
- Google Benchmark project

Type:
- official technical documentation

Documentation:
- https://google.github.io/benchmark/random_interleaving.html

Source repository:
- https://github.com/google/benchmark/blob/main/docs/random_interleaving.md

Can support:
- interleaving benchmark repetitions can reduce the influence of changing
  system state on benchmark comparisons,
- executing all repetitions of one benchmark as a single block is not the only
  possible benchmark ordering,
- interleaving is used by an established microbenchmarking framework as a
  technique for reducing run-to-run variance.

Planned use:
- additional technical justification for interleaving implementations during
  benchmark measurements.

Notes:
- Google Benchmark uses random interleaving.
- This project currently uses deterministic balanced rotation rather than
  Google's random interleaving.
- The source therefore supports the general motivation for interleaving, not
  the claim that our exact rotation algorithm is Google's methodology.
- Academic sources should be preferred for the main methodological argument.