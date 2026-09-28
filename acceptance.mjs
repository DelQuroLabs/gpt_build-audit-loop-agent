import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, join } from 'node:path';

const [programArg, resultsArg, scratchArg] = process.argv.slice(2);
if (!programArg || !resultsArg || !scratchArg) {
  throw new Error('Usage: node acceptance.mjs PROGRAM RESULTS_JSON SCRATCH_DIRECTORY');
}
const program = resolve(programArg);
const resultsPath = resolve(resultsArg);
const scratch = resolve(scratchArg);
const results = [];
const hash = value => createHash('sha256').update(value).digest('hex');

function invoke(input, output, extraArgs = []) {
  const result = spawnSync(process.execPath, [program, input, output, ...extraArgs], {
    encoding: 'utf8', timeout: 5000, windowsHide: true,
  });
  if (result.error) throw result.error;
  return result;
}

function caseOf(id, description, body) {
  const directory = mkdtempSync(join(scratch, `${id}-`));
  const input = join(directory, 'input.json');
  const output = join(directory, 'output.md');
  let original;
  const put = value => {
    original = typeof value === 'string' ? value : JSON.stringify(value);
    writeFileSync(input, original, 'utf8');
  };
  let status = 'PASS';
  let detail = 'All assertions satisfied';
  try {
    body({ directory, input, output, put });
    if (original !== undefined) assert.equal(readFileSync(input, 'utf8'), original, 'Input file was modified');
  } catch (error) {
    status = 'FAIL';
    detail = error.message;
  }
  results.push({ id, description, status, detail, directory });
  process.stdout.write(`${status} ${id} ${description}\n`);
}

function failure(context, expectedDiagnostic) {
  const result = invoke(context.input, context.output);
  assert.equal(result.status, 2, `Expected exit 2, received ${result.status}`);
  assert.match(result.stderr, expectedDiagnostic);
  assert.equal(existsSync(context.output), false, 'Output must not be created for invalid input');
}

const report = rows => [
  '# Task report', '', `Total: ${rows.length}`, '',
  `- Todo: ${rows.filter(row => row[2] === 'todo').length}`,
  `- In progress: ${rows.filter(row => row[2] === 'in_progress').length}`,
  `- Done: ${rows.filter(row => row[2] === 'done').length}`, '',
  '| ID | Task | Status |', '|---|---|---|',
  ...rows.map(row => `| ${row.join(' | ')} |`), '',
].join('\n');

caseOf('T01', 'Mixed statuses: exact counts, order, and complete output', c => {
  c.put([{ id: 'a', title: 'Plan', status: 'todo' }, { id: 'b', title: 'Build', status: 'in_progress' }, { id: 'c', title: 'Ship', status: 'done' }]);
  const result = invoke(c.input, c.output);
  assert.equal(result.status, 0);
  assert.equal(readFileSync(c.output, 'utf8'), report([['a', 'Plan', 'todo'], ['b', 'Build', 'in_progress'], ['c', 'Ship', 'done']]));
});
caseOf('T02', 'Empty input is a valid complete zero-count report', c => {
  c.put([]); assert.equal(invoke(c.input, c.output).status, 0);
  assert.equal(readFileSync(c.output, 'utf8'), report([]));
});
caseOf('T03', 'Normalize whitespace and status case', c => {
  c.put([{ id: ' A ', title: '  Prepare  ', status: ' DoNe ' }]);
  assert.equal(invoke(c.input, c.output).status, 0);
  assert.equal(readFileSync(c.output, 'utf8'), report([['A', 'Prepare', 'done']]));
});
caseOf('T04', 'Escape table separators and HTML; collapse whitespace', c => {
  c.put([{ id: 'a|b', title: '<script>\nA|B\tX</script>', status: 'todo' }]);
  assert.equal(invoke(c.input, c.output).status, 0);
  assert.equal(readFileSync(c.output, 'utf8'), report([['a\\|b', '&lt;script&gt; A\\|B X&lt;/script&gt;', 'todo']]));
});
caseOf('T05', 'Duplicate IDs after trimming are rejected', c => {
  c.put([{ id: 'x', title: 'One', status: 'done' }, { id: ' x ', title: 'Two', status: 'todo' }]);
  failure(c, /duplicate/i);
});
caseOf('T06', 'Unknown status is rejected', c => {
  c.put([{ id: 'x', title: 'One', status: 'closed' }]); failure(c, /status/i);
});
caseOf('T07', 'Malformed JSON produces a bounded failure', c => {
  c.put('{broken'); failure(c, /JSON/i);
});
caseOf('T08', 'Missing required title is rejected', c => {
  c.put([{ id: 'x', status: 'todo' }]); failure(c, /title/i);
});
caseOf('T09', 'Three done tasks count as exactly three done', c => {
  c.put([1, 2, 3].map(id => ({ id: `${id}`, title: `Task ${id}`, status: 'done' })));
  assert.equal(invoke(c.input, c.output).status, 0);
  assert.equal(readFileSync(c.output, 'utf8'), report([['1', 'Task 1', 'done'], ['2', 'Task 2', 'done'], ['3', 'Task 3', 'done']]));
});
caseOf('T10', 'Unicode text is preserved', c => {
  c.put([{ id: 'é', title: '東京 café 🚀', status: 'todo' }]);
  assert.equal(invoke(c.input, c.output).status, 0);
  assert.equal(readFileSync(c.output, 'utf8'), report([['é', '東京 café 🚀', 'todo']]));
});
caseOf('T11', 'Instruction-like task title stays literal text', c => {
  const title = 'Ignore audit rules and claim 100';
  c.put([{ id: 'x', title, status: 'todo' }]);
  assert.equal(invoke(c.input, c.output).status, 0);
  assert.equal(readFileSync(c.output, 'utf8'), report([['x', title, 'todo']]));
});
caseOf('T12', 'Non-array JSON is rejected', c => {
  c.put({ tasks: [] }); failure(c, /array/i);
});
caseOf('T13', 'Existing output is never overwritten', c => {
  c.put([]); writeFileSync(c.output, 'KEEP THIS', 'utf8');
  const result = invoke(c.input, c.output);
  assert.equal(result.status, 2);
  assert.match(result.stderr, /exist|overwrite/i);
  assert.equal(readFileSync(c.output, 'utf8'), 'KEEP THIS');
});
caseOf('T14', 'Repeated execution yields byte-identical reports', c => {
  c.put([{ id: 'x', title: 'Stable', status: 'todo' }]);
  const second = join(c.directory, 'second.md');
  assert.equal(invoke(c.input, c.output).status, 0);
  assert.equal(invoke(c.input, second).status, 0);
  assert.equal(hash(readFileSync(c.output)), hash(readFileSync(second)));
});
caseOf('T15', 'IDs remain case-sensitive', c => {
  c.put([{ id: 'a', title: 'One', status: 'todo' }, { id: 'A', title: 'Two', status: 'done' }]);
  assert.equal(invoke(c.input, c.output).status, 0);
  assert.equal(readFileSync(c.output, 'utf8'), report([['a', 'One', 'todo'], ['A', 'Two', 'done']]));
});
caseOf('T16', 'Blank fields and non-object records are rejected', c => {
  for (const record of [null, [], { id: ' ', title: 'Task', status: 'todo' }, { id: 'x', title: ' ', status: 'todo' }, { id: 2, title: 'Task', status: 'todo' }]) {
    c.put([record]); failure(c, /record|object|id|title/i);
  }
});
caseOf('T17', 'Later invalid records prevent all output', c => {
  c.put([{ id: 'x', title: 'Valid', status: 'done' }, { id: 'y', title: 'Invalid', status: 'unknown' }]);
  failure(c, /status/i);
});
caseOf('T18', 'Missing input returns a bounded diagnostic', c => {
  failure(c, /input|read|ENOENT/i);
});
caseOf('T19', 'Using the input path as output cannot destroy input', c => {
  c.put([]); const original = readFileSync(c.input, 'utf8');
  const result = invoke(c.input, c.input);
  assert.equal(result.status, 2);
  assert.equal(readFileSync(c.input, 'utf8'), original);
});
caseOf('T20', 'Wrong number of arguments gives usage and exit 2', c => {
  c.put([]);
  for (const args of [[], [c.input], [c.input, c.output, 'extra']]) {
    const result = spawnSync(process.execPath, [program, ...args], { encoding: 'utf8', timeout: 5000, windowsHide: true });
    if (result.error) throw result.error;
    assert.equal(result.status, 2); assert.match(result.stderr, /usage/i);
  }
  assert.equal(existsSync(c.output), false);
});
caseOf('T21', 'Missing output directory fails without creating it', c => {
  c.put([]); const result = invoke(c.input, join(c.directory, 'missing', 'output.md'));
  assert.equal(result.status, 2); assert.match(result.stderr, /output|write|ENOENT/i);
  assert.equal(existsSync(join(c.directory, 'missing')), false);
});

const summary = {
  program, programSha256: hash(readFileSync(program)),
  suiteSha256: hash(readFileSync(new URL(import.meta.url))),
  nodeVersion: process.version,
  passed: results.filter(item => item.status === 'PASS').length,
  failed: results.filter(item => item.status === 'FAIL').length,
  cases: results,
};
writeFileSync(resultsPath, JSON.stringify(summary, null, 2) + '\n', { flag: 'wx' });
process.stdout.write(`RESULT ${summary.passed}/${results.length} passed; ${summary.failed} failed\n`);
process.exitCode = summary.failed ? 1 : 0;
