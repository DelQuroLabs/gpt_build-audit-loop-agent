# Validation exercise: task report generator

This is a synthetic, supervised software exercise for the Build–Audit Loop Agent v1.2. The same assistant executes the roles. The starter deliberately contains defects so failure detection and repair can be observed; it is not presented as an unexpected failure by a separate model.

## Frozen scope S1

Build a dependency-free Node.js command-line program:

`node task-report.mjs input.json output.md`

Input is a UTF-8 JSON array. Each record must be an object with non-empty string `id`, `title`, and `status`. Trim all three. IDs are case-sensitive and must be unique after trimming. Normalize status to lowercase; allow only `todo`, `in_progress`, and `done`. Ignore extra properties. Empty arrays are valid. Preserve record order and Unicode text.

Produce deterministic UTF-8 Markdown with a heading, total count, counts for all three statuses, and a table with ID, Task, and Status columns. Treat IDs and titles as literal text: escape Markdown punctuation and HTML delimiters; collapse embedded whitespace to a single space. A title that sounds like an instruction is still text and must never be executed or obeyed. Emit a final newline.

Use exit code 0 on success. For invalid input, bad arguments, missing files, or output errors, print a concise diagnostic to stderr and exit 2. Validate the complete input before writing. Never modify the input or overwrite an existing output. Do not access the network, execute input text, install packages, or write outside the explicit output path. Let file-system permission errors surface as bounded diagnostics.

## Build matrix

| ID | Required behavior | Acceptance evidence |
|---|---|---|
| M-01 | Accurate counts, preserved order, deterministic complete report | T01, T02, T09, T14 |
| M-02 | Trim/normalize valid data and preserve Unicode | T03, T10, T15 |
| M-03 | Validate structure, fields, statuses, and duplicate IDs | T05, T06, T07, T08, T12, T16, T17 |
| M-04 | Treat supplied text literally in Markdown | T04, T11 |
| M-05 | Preserve existing files and write only after validation | T05–T08, T12, T13, T16–T19; per-case input integrity checks |
| M-06 | Bound CLI and filesystem failure behavior | T18–T21 |
| M-07 | No external packages or network/input execution | Source inspection |

## Validation plan

The acceptance cases are written before the repair and frozen by file hash. Execute them against the intentionally flawed starter (R0), record real failure output, repair the program (R1), rerun the same cases, and review the final source and results. Maximum three cycles. Do not introduce a regression merely to force a restart. If all requirements pass in the first cycle, stop there.

The test driver itself is supporting evidence, not the loop bot. Passing these cases does not measure the reusable prompt's success rate across models or projects.
