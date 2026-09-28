# Build–Audit Loop starter kit

## Use the agent prompt

1. Open `build-audit-loop-agent.md`.
2. Copy the text between BEGIN AGENT PROMPT and END AGENT PROMPT into your agent's instructions or a new chat.
3. Fill in the Project brief below that prompt, especially the objective, deliverable, requirements, and destination.
4. Let the agent build, audit, repair, and review within the configured cycle limit. A restart continues from its recorded state; it does not start over or reset its allowance.

The default acceptance target is 95/100, with zero open findings and all required checks passed. The score is evidence-based judgment, not a guarantee. The prompt requires an actual agent runtime and any tools your project needs; this kit does not install a background service.

## What was validated

The included example is a small task-report generator used in a supervised exercise. Its intentionally flawed starter passed 6 of 21 acceptance cases. The repaired program passed all 21 cases without changing the test suite or the project brief. The same assistant performed the build and review roles.

Read `build-audit-loop-validation.md` for the evidence and limits. The earlier specification review is in `build-audit-loop-audit.md`.

## Run the example

The example uses Node.js standard libraries with no package installation. It was exercised with Node.js v24.15.0 on Windows. Other runtime/platform combinations were not tested in this exercise.

From the extracted kit directory:

```text
node task-report.mjs sample-tasks.json new-report.md
```

The destination must not already exist. The program reads the JSON input and writes a Markdown task report; it does not modify the input.

## Reproduce the acceptance checks

```text
node acceptance.mjs task-report.mjs new-results.json .
```

The driver creates uniquely named synthetic fixture directories in the current directory. Choose a new results filename for each run. It exits 0 when all cases pass, and 1 when an assertion fails. A runtime/setup failure is not a measured program failure.

To compare with the deliberately flawed starter:

```text
node acceptance.mjs task-report-R0.mjs starter-results.json .
```

Expected starter result: 6 passed, 15 failed, exit 1. These are intentional fixture defects, not evidence that a separately deployed model made those mistakes. Never run the starter against valuable files; its overwrite defect is the subject of one test. The acceptance driver supplies isolated, synthetic files for that purpose.

## Files

- `build-audit-loop-agent.md`: reusable instructions and project intake form.
- `build-audit-loop-audit.md`: original three-pass specification audit.
- `build-audit-loop-validation.md`: this exercise's results and limitations.
- `brief.md`: frozen requirements and build matrix for the exercise.
- `task-report-R0.mjs`: intentionally flawed starter.
- `task-report.mjs`: repaired program.
- `acceptance.mjs`: unchanged acceptance suite.
- `sample-tasks.json` and `sample-report.md`: input and generated example.
- `baseline-results.json` and `repaired-results.json`: actual test records.
- `checkpoint.json`: final exercise state, findings, and matrix.

Historical test records include original workspace paths. Reproduction creates new fixture paths; byte hashes identify the original source and suite independently of those paths.
