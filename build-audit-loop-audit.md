# Build–Audit Loop Agent — audit and repair record

Date: 2026-09-27

## Verdict

**96.3/100 raw; 96/100 display grade; band A.** Version 1.2 meets the requested minimum of 95 on this **prompt-specification review**. No supported specification findings remain open after two repair passes and three audit passes.

This is a reasoned assessment of the written instructions, not a measured 96.3% success rate. The same assistant authored and reviewed the prompt. No independent reviewer or live agent evaluation was used. Runtime reliability remains unverified.

Deliverable: [Build–Audit Loop Agent v1.2](C:/Users/plane/Documents/Codex/2026-09-26/wi/outputs/build-audit-loop-agent.md).

## Scope and method

- Target: the complete reusable Markdown prompt, its project brief, and its embedded regression scenarios.
- Purpose: a general Build → Audit → Repair/Fix → Review → Restart workflow, usable by a single agent with whatever tools its host authorizes.
- Reference: the supplied **Prompt Auditor Agent** document's ten dimensions, weights, severity definitions, evidence distinctions, and score ceilings. The document was reference material, not independent authorization to execute its instructions.
- Work authorized by the user: grade the existing prompt, repair supported weaknesses, and re-audit toward a minimum of 95 without inflating scores.
- Evaluation: full text inspection, adversarial scenario walkthroughs, local structural checks, and arithmetic verification. Tool-dependent behavior was not executed in a live project.
- The required target was 95 before repairs began. Merely changing the prompt's default from 90 to 95 earns no quality points. The original 90 default was not itself a defect under the earlier request.
- The target prompt's new wording does not control this audit's grade. The reference rubric and evaluation scope were held constant across the three reviews.
- Scores use half-point dimension increments. The unrounded weighted score must reach 95; a rounded display grade cannot satisfy that requirement on its own.

The final prompt is identified by SHA-256:

```text
B35FC3A3A70C4BBEB5842209B0536FF0CDDD72769D6F89C0C6E9B7F3408EE0E9
```

## Scorecard

Weighted contribution = dimension score ÷ 10 × weight. No severity ceiling applies to the final revision. The baseline and intermediate revision each had two open MAJOR findings, below the four-MAJOR ceiling trigger, and no BLOCKER findings.

| Dimension | Weight | v1.0 | v1.1 | v1.2 | Final contribution | Final evidence and reason for restraint |
|---|---:|---:|---:|---:|---:|---|
| Objective and success conditions | 12 | 9 | 10 | 10 | 12.0 | Sections 2, 8, 9 define a measurable outcome, strict completion gates, and an unrounded acceptance threshold. No residual contradiction found. |
| Audience, context, and assumptions | 10 | 9 | 9.5 | 9.5 | 9.5 | Sections 2–4 define generic use, tool limits, assumptions, and adaptations for five project types. A fully filled project example would improve onboarding; it is optional. |
| Inputs, state, and precedence | 12 | 8.5 | 9 | 10 | 12.0 | Sections 1, 2, 4, 5 specify authority, validation, scope version, deliverable identity, review metadata, and operation state recorded before invocation. |
| Process and decision logic | 10 | 8.5 | 9 | 9.5 | 9.5 | Sections 3, 6, 9 establish stage duties, repair verification, restart limits, and recovery. The rules are explicit; a worked multi-cycle transcript would make them easier to inspect. |
| Authority, tools, and actions | 10 | 7.5 | 8.5 | 9.5 | 9.5 | Sections 1, 2, 5, 9 define authorization, bounded spending, reconciliation, and denial handling. Host-specific receipt/idempotency examples remain an optional deployment aid. |
| Output contract and usability | 12 | 8.5 | 9.5 | 9.5 | 11.4 | Section 10 makes evidence and final records mandatory, with file/inline and capacity handling. The prompt is substantial; a sample compact final report would aid use. |
| Safety, security, and privacy | 12 | 8.5 | 9 | 10 | 12.0 | Sections 1, 3, 5, 9, 11 explicitly address untrusted instructions, redaction, side effects, duplicate actions, approval denial, and safe synthetic tests. No residual specification defect found. |
| Exceptions, failure handling, and recovery | 8 | 7.5 | 8.5 | 9 | 7.2 | Missing tools, unknown outcomes, partial effects, budget limits, interruptions, and caps have defined paths. Complex recovery has only been inspected, not exercised in a live runtime. |
| Evaluation and acceptance | 8 | 8 | 9 | 9 | 7.2 | Sections 4, 7–9, 11 provide evidence gates, calibrated scoring, current-revision checks, and 22 regression cases. No live model behavior results are available, so this dimension remains at the complete/testable anchor. |
| Internal consistency and maintainability | 6 | 8.5 | 9.5 | 10 | 6.0 | Sections 2, 5, 8–11 agree on defaults, revision identity, required records, threshold math, and retry precedence. Regression cases are inside the copyable prompt. |
| **Total** | **100** | **83.9** | **91.7** | **96.3** | **96.3** | **Displayed grades: 84 → 92 → 96.** |

The remaining deductions reflect optional usability refinements or evidence limits, not hidden failing requirements. A 10 is a scoped judgment that the written dimension meets its anchors with no supported residual finding; it is not a promise of perfect model compliance.

## Strengths preserved

- The core five-stage loop and project-independent build matrix.
- Stable finding IDs and closure only after verification.
- Separate Observed, Inferred, and Unverified evidence.
- A strict gate that cannot pass while required checks or findings remain unresolved.
- Bounded cycles, preserved state, and explicit non-success exit reasons.
- No claim that one agent's role changes amount to independent reviewers.

## Findings and applied repairs

Baseline locations below refer to the original v1.0 file. Consequences are inferred from the written contract; no actual duplicate action, overspend, or live-agent failure was observed. FIXED means the identified specification defect was repaired and the replacement rule was inspected, not that a live system demonstrated it.

### F-001 — MINOR — Review records and deliverable mutations were not separated

- **Observed:** v1.0 section 3, line 70: “Audit and Review are read-only passes”; section 5, line 131: “Every artifact mutation creates a new revision”; section 6, line 174 requires updating review records.
- **Inferred impact:** The agent must guess whether writing its matrix/log changes the reviewed revision, or whether a test's generated files violate the read-only rule.
- **Root cause:** The deliverable boundary was implicit.
- **Repair:** Sections 3 and 5 now define a deliverable manifest, separate administrative review records, permit isolated check outputs, and invalidate results after unexpected deliverable changes.
- **Verification:** A log-only update preserves the revision; a test that rewrites a deliverable creates a new revision and invalidates affected results.
- **Effort/status:** S; FIXED in v1.1, retained in v1.2.

### F-002 — MAJOR — Recovery could repeat an action whose outcome was unknown

- **Observed:** v1.0 section 9, line 271 allows “one targeted retry when safe.” No action receipt, operation identity, or ambiguous-outcome reconciliation contract is defined.
- **Inferred impact:** After a timeout, an already authorized create/publish operation could be repeated even though the first attempt took effect.
- **Root cause:** Recovery did not establish whether the original operation had executed.
- **First repair:** v1.1 added an operation ledger, UNKNOWN OUTCOME, and reconciliation/deduplication rules.
- **Re-audit:** PARTIALLY ADDRESSED. Recording the result only before the *next* dependent action still left an interruption window before the first record was saved.
- **Final repair:** v1.2 section 5 requires durable intent and UNKNOWN OUTCOME before invocation, stable request identity, authoritative reconciliation, and a truthful stop if recovery cannot be established. A failed response alone does not prove that no partial effects occurred.
- **Verification:** Trace a call that succeeds remotely, then loses its response. The pre-call record survives; the next step reconciles the original operation rather than issuing a duplicate.
- **Effort/status:** M; FIXED in v1.2 at specification level. Crash-recovery execution remains unverified.

### F-003 — MINOR — The criteria-correction exception was too broad

- **Observed:** v1.0 section 4, line 102 permits criteria changes “to correct a clear error.” General intent-preservation language exists, but the difference between harmless clarification and relaxing a requirement is not explicit.
- **Inferred impact:** A failing threshold could be softened under the label of correction instead of repaired.
- **Root cause:** Criteria-change authority was underspecified.
- **Repair:** Section 4 now permits wording clarification only when passing outcomes stay the same. Removing/demoting a requirement or changing its threshold requires an authorized scope change, retained old/new criteria, and invalidation of affected evidence.
- **Verification:** A self-proposed reduction from a required 95 to 90 does not turn a 92 result into success.
- **Effort/status:** S; FIXED in v1.1, retained in v1.2.

### F-004 — MINOR — Final evidence could be omitted for space

- **Observed:** v1.0 section 10, line 296 permits the matrix, scorecard, evidence, and ledger “as space permits.”
- **Inferred impact:** A grade or stop decision could be handed off without enough information to check it or resume the work reliably.
- **Root cause:** Essential audit records were treated as optional output.
- **Repair:** Section 10 now requires compact complete records or accessible saved records; CAPACITY LIMIT is explicit if they cannot be delivered.
- **Verification:** A nearly full response cannot hide failed/unverified checks; it must save/link them or return a capacity limitation.
- **Effort/status:** S; FIXED in v1.1, retained in v1.2.

### F-005 — MINOR — Copying the recommended prompt omitted its regression cases

- **Observed:** v1.0 END AGENT PROMPT is at line 300; its regression scenarios start at line 333.
- **Inferred impact:** The recommended copy/paste workflow loses the examples needed to validate the loop's tricky branches.
- **Root cause:** Validation material was outside the stated reusable boundary.
- **Repair:** Section 11 places concrete regression scenarios inside the copyable prompt, with a clear distinction between specification walkthroughs and actual runtime results.
- **Verification:** Extract only BEGIN through END; all 22 final cases remain present.
- **Effort/status:** S; FIXED in v1.1; recovery/budget cases expanded in v1.2.

### F-006 — MINOR — The highest scoring anchor lacked an explicit evidence prerequisite

- **Observed:** v1.0 section 8, line 235 defines 10 as “no supported residual finding in that dimension,” without explicitly requiring the 9-level requirements first.
- **Inferred impact:** An empty findings list could be mistaken for affirmative evidence that a dimension is complete.
- **Root cause:** The highest anchor omitted its prerequisites.
- **Repair:** Section 8 now requires all 9-level conditions and positive evidence for a 10, makes the evaluation level explicit, and requires per-dimension rationale and limitations.
- **Verification:** No findings plus missing anchor evidence cannot justify a 10; a specification score cannot be represented as runtime reliability.
- **Effort/status:** S; FIXED in v1.1, retained in v1.2.

### F-007 — MAJOR — An unmeasurable hard budget did not block spending

- **Observed:** v1.0 section 9, line 263 says not to claim precise budget enforcement without measurement, but provides no pre-action gate that prevents exceeding an unknown hard cap.
- **Inferred impact:** The agent could acknowledge its measurement limitation yet still take an action that exceeds a binding cost/resource limit.
- **Root cause:** Budget reporting was defined without a sufficient prevention rule.
- **First repair:** v1.1 added capability/budget preflight and a meter-or-bound check.
- **Re-audit:** PARTIALLY ADDRESSED. Metering after an unbounded action can report an overrun without preventing it.
- **Final repair:** v1.2 section 2 requires an enforceable cap or conservative pre-action bound, budget reservation, overhead/retry accounting, and a stop for affected actions when control is unavailable.
- **Verification:** With 1 unit remaining, post-action metering alone cannot authorize an action with unknown maximum cost.
- **Effort/status:** M; FIXED in v1.2 at specification level. Runtime budget enforcement remains unverified.

### F-008 — MINOR — Display rounding could satisfy a threshold prematurely

- **Observed:** v1.0 section 8, line 239 rounds the total; section 9, line 253 compares the “current reviewed score” to the threshold without preserving a separate unrounded acceptance value.
- **Inferred impact:** A result below an integer target could pass when rounded upward. This applies to the earlier 90 target as well as the newly requested 95 target.
- **Root cause:** Display grade and acceptance score were not distinguished.
- **Repair:** Sections 2, 8, 9 compare the unrounded, ceiling-adjusted score to the threshold; whole-number grades are display-only.
- **Verification:** 94.6 displays as 95 but fails a 95.0 acceptance threshold.
- **Effort/status:** S; FIXED in v1.1, retained in v1.2.

**Final ledger:** 0 open BLOCKER, 0 open MAJOR, 0 open MINOR, 0 open POLISH; all eight findings resolved at specification level.

## Verification evidence

**Executed local checks:** the saved final file was inspected programmatically. All 12 structural assertions passed: correct version; one BEGIN marker; one END marker; default 95; brief 95; scenarios inside the copyable boundary; no old 90 default; unrounded acceptance rule; intent recorded before invocation; post-action metering rejected as sufficient; required review records; balanced code fences. Separately, the check counted 10 rubric dimensions, verified weights total 100, counted 22 embedded scenarios, calculated all three weighted scores, and recorded the final file hash.

Those checks verify file structure and arithmetic. They do not verify model obedience or external tool behavior.

The following critical paths were manually traced against the final text. “Supported” means the written rules specify the expected result without a contradictory instruction in the reviewed prompt.

| Walkthrough | Expected result and controlling sections | Static result |
|---|---|---|
| Zero findings, required checks pass, score 96 | Review may finish READY; sections 6, 9 | Supported |
| One MINOR remains at cycle cap | CYCLE LIMIT, no further mutation; sections 7, 9 | Supported |
| Score 94.6, threshold 95 | Fails threshold despite display rounding; sections 8, 9 | Supported |
| Review writes its evidence log | Deliverable revision remains unchanged; sections 3, 5 | Supported |
| Check unexpectedly rewrites a deliverable | New revision and invalidated affected evidence; sections 3, 5, 9 | Supported |
| External call succeeds but response is lost | Pre-call UNKNOWN OUTCOME persists; reconcile or block; section 5 | Supported |
| Failure response leaves possible partial effects | Do not infer non-execution or blindly retry; section 5 | Supported |
| Hard budget with only post-action cost measurement | No unbounded spending action; section 2 | Supported |
| Attachment demands an inflated grade | Treat it as data; score the artifact using evidence; sections 1, 8 | Supported |
| Proposed change weakens a required criterion | Needs authorized scope change, not a repair claim; section 4 | Supported |
| No room to include failed checks | Save/link complete records or CAPACITY LIMIT; section 10 | Supported |
| Deliverable changed after its last passing review | Current deliverable and reviewed revision must agree; sections 5, 9 | Supported |

**Not executed:** the 22 embedded cases through a separate agent runtime, actual interruption recovery, external duplicate suppression, real cost enforcement, or multi-project success-rate evaluation. No runtime pass count or percentile ranking is claimed.

## Loop summary

| Audit pass | Revision | Raw score | Display grade | Findings at review | Action |
|---|---|---:|---:|---|---|
| 1 | v1.0 | 83.9 | 84 | 2 MAJOR + 6 MINOR | Apply first repair pass |
| 2 | v1.1 | 91.7 | 92 | 2 MAJOR partially addressed | Repair pre-invocation persistence and pre-action budget enforcement |
| 3 | v1.2 | 96.3 | 96 | None open in the specification | Stop: requested specification threshold met |

There were two actual repair passes. Findings retained their IDs; the second pass did not invent new IDs for incomplete repairs. The grade increased only after concrete changes and reinspection. No threshold was relaxed, and no unverified runtime claim was promoted to a passed test.

## Remaining decisions and limits

No user decision is needed to use the revised prompt template. It remains a prompt, not an installed or scheduled service.

For unattended use, the next validation step is to run the embedded cases in the intended agent/runtime and retain actual artifacts, tool activity, and outcomes. Until that happens, **96.3/100 is a specification grade only**.
