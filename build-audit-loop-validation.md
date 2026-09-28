# Build–Audit Loop — supervised validation

Date: 2026-09-28 · Prompt version: 1.2

## Result

A supervised Build → Audit → Repair → Review exercise completed on a small local task-report generator. The deliberately flawed starter passed **6 of 21 acceptance cases**. The repaired program passed **21 of 21**, using the **same test suite and requirements**.

Five root-cause findings were repaired and verified. No restart was necessary: the first repair/review cycle satisfied the exercise's requirements. The restart branch was not exercised, and no regression was deliberately introduced to force one.

The reusable prompt's earlier **96.3/100 specification assessment remains unchanged**. This single, author-supervised exercise is not a measured 95%+ reliability result for the bot and is not an independent model evaluation.

## Setup and boundaries

- The same assistant used the prompt's working roles; no second agent or fresh model session was created.
- The project was a dependency-free Node.js CLI that reads synthetic JSON tasks and creates a Markdown report.
- The starter was deliberately defective. Its baseline failures demonstrate that the checks detect those seeded problems, not that an independent model made spontaneous mistakes.
- Requirements and the acceptance suite were written before repair and kept unchanged, verified by hashes.
- Execution used Node.js v24.15.0 on Windows, with only local synthetic inputs and outputs.
- No network access, publication, purchases, or external messages were part of the exercise.

## Observed loop

| Stage | Actual action | Evidence |
|---|---|---|
| Build/setup | Established brief S1, starter R0, and 21 acceptance cases | `brief.md`, `task-report-R0.mjs`, `acceptance.mjs` |
| Audit | Executed the suite against R0; observed 15 failed cases | `baseline-results.json`; process exit 1 |
| Repair | Corrected five root causes; recorded findings as pending verification | `task-report.mjs`; checkpoint transition from R0 to R1 |
| Review | Executed the unchanged suite against R1; inspected source; matched its hash to the tested source | `repaired-results.json`; process exit 0 |
| Restart decision | No further cycle was warranted after acceptance passed | Final `checkpoint.json`, cycle 1 of maximum 3 |

## Findings and closure

| Finding | Severity | Observed defect | Repair | Verification |
|---|---|---|---|---|
| D-001 | MAJOR | In-progress tasks were counted as done | Count each allowed status explicitly | T01 passed after repair |
| D-002 | MAJOR | Missing schema validation, normalization, and duplicate checks | Validate every record before writing; normalize fields; enforce unique IDs | T03, T05, T06, T08, T12, T16, T17 passed |
| D-003 | MINOR | Unescaped HTML/newlines/pipes could damage the report | Escape literal cell text and normalize embedded whitespace | T04 passed; additional escaping rules inspected in source |
| D-004 | MAJOR | Existing output, including the input itself, could be overwritten | Use exclusive creation after complete validation | T13 and T19 passed |
| D-005 | MINOR | Invalid arguments and filesystem/parse errors lacked the specified exit/diagnostic contract | Add argument validation and a bounded error boundary | T07, T18, T20, T21 passed |

All five findings are **FIXED for this exercise's scope**. The test assertions were not weakened or removed. Requirements did not change between R0 and R1.

## Acceptance evidence

Each row is a test case, potentially containing several assertions. These counts are not a population success rate.

| Case | Check | R0 | R1 |
|---|---|---|---|
| T01 | Mixed-status counts, order, and exact output | FAIL | PASS |
| T02 | Complete empty report | PASS | PASS |
| T03 | Whitespace and status normalization | FAIL | PASS |
| T04 | Escape HTML/table separators and collapse whitespace | FAIL | PASS |
| T05 | Duplicate IDs after trimming | FAIL | PASS |
| T06 | Unknown status rejection | FAIL | PASS |
| T07 | Malformed JSON error handling | FAIL | PASS |
| T08 | Missing title rejection | FAIL | PASS |
| T09 | Three done tasks counted correctly | PASS | PASS |
| T10 | Unicode preserved | PASS | PASS |
| T11 | Instruction-like title retained as text | PASS | PASS |
| T12 | Non-array JSON rejection | FAIL | PASS |
| T13 | Existing output preserved | FAIL | PASS |
| T14 | Deterministic repeated output | PASS | PASS |
| T15 | Case-sensitive IDs | PASS | PASS |
| T16 | Blank/invalid fields and non-object records | FAIL | PASS |
| T17 | Invalid later record prevents output | FAIL | PASS |
| T18 | Missing input diagnostic | FAIL | PASS |
| T19 | Input path cannot be overwritten as output | FAIL | PASS |
| T20 | Wrong argument count | FAIL | PASS |
| T21 | Missing output directory | FAIL | PASS |
| **Total** | | **6/21** | **21/21** |

For successful cases with an input fixture, the driver also checked that the input content was unchanged. T11 tests literal handling in the example program; it does not establish general LLM resistance to prompt injection.

The source inspection found only the expected filesystem import, JSON parsing, validation, rendering, and exclusive output creation. There are no network calls, package dependencies, shell calls, or execution of supplied task text in the repaired program.

## Exercise quality review

This scorecard applies only to the tiny **example program**, using the prompt's rubric. It is separate from the reusable agent prompt's specification grade and is not a reliability measurement. Ratings remain reviewer judgments even though the acceptance assertions were actually executed.

| Dimension | Weight | Final score / 10 | Contribution | Evidence or limit |
|---|---:|---:|---:|---|
| Objective and success conditions | 12 | 10 | 12.0 | Required report behavior and error outcomes established by the frozen checks |
| Audience, context, assumptions | 10 | 9.5 | 9.5 | CLI contract and reproducible brief are clear; broader audience examples are optional |
| Inputs, state, precedence | 12 | 10 | 12.0 | Schema, normalization, duplicates, input integrity, and literal text verified |
| Process and decision logic | 10 | 9.5 | 9.5 | Read/validate/render/write ordering inspected; a flow illustration is optional |
| Authority, tools, actions | 10 | 10 | 10.0 | Local filesystem scope, no input execution/network, exclusive writes verified |
| Output contract and usability | 12 | 9.5 | 11.4 | Exact deterministic Markdown verified; presentation is intentionally simple |
| Safety, security, privacy | 12 | 9.5 | 11.4 | File preservation and text escaping verified; safe-use notes could be expanded for other hosts |
| Exceptions and recovery | 8 | 9.5 | 7.6 | Specified CLI/input/output failures tested; no claim of transactional writes or cross-platform behavior |
| Evaluation and acceptance | 8 | 9.5 | 7.6 | Frozen before/after checks plus source review; broader property-based coverage is optional |
| Consistency and maintainability | 6 | 9.5 | 5.7 | Small functions and no dependencies; additional developer examples are optional |
| **Total** | **100** | | **96.7** | **No open findings or applicable score ceilings** |

This provides the exercise's qualitative acceptance gate in addition to its 21 passing cases. It does not increase the bot's 96.3 specification assessment.

## Reproducibility

The starter kit contains the prompt, earlier audit, this report, the frozen brief, starter and repaired sources, acceptance driver, actual result records, and a runnable example. Follow its README to reproduce the checks with Node.js; no package installation is needed.

| Artifact | SHA-256 |
|---|---|
| Frozen brief | `11CA287BE017CF812793B124948DCEBE7B9F21D8180A3A0AE47D45046F822FB0` |
| Unchanged acceptance suite | `5DC691C784A08F558CC2962BCD602911DD959892B97076A67ABDE6943FD3B812` |
| Starter R0 | `0A86E6784145DCFDC558DA829F35FB114BCE566B1AB3D3A19B8D9F21DCD5A9F8` |
| Repaired R1 | `47C99372F25CD5D914EB2007B1E646B19B824AED172DF53A5E7F9C256CD87D5F` |

## What remains unverified

Independent or repeated execution of the reusable prompt across models and real projects; autonomous restart behavior; interruption recovery; external-action deduplication; budget enforcement; and performance on project types other than this small software exercise.

No new prompt defect was established by this exercise, so version 1.2 was preserved instead of being expanded to manufacture another revision or a higher score.
