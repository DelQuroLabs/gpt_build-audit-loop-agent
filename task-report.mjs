import { readFileSync, writeFileSync } from 'node:fs';

const allowedStatuses = new Set(['todo', 'in_progress', 'done']);

function validate(value) {
  if (!Array.isArray(value)) throw new Error('Input must be a JSON array.');
  const seenIds = new Set();
  return value.map((record, index) => {
    const label = `Record ${index + 1}`;
    if (record === null || typeof record !== 'object' || Array.isArray(record)) {
      throw new Error(`${label} must be an object.`);
    }
    const normalized = {};
    for (const field of ['id', 'title', 'status']) {
      if (typeof record[field] !== 'string' || record[field].trim() === '') {
        throw new Error(`${label}: ${field} must be a non-empty string.`);
      }
      normalized[field] = record[field].trim();
    }
    normalized.status = normalized.status.toLowerCase();
    if (!allowedStatuses.has(normalized.status)) {
      throw new Error(`${label}: status must be todo, in_progress, or done.`);
    }
    if (seenIds.has(normalized.id)) throw new Error(`${label}: duplicate id.`);
    seenIds.add(normalized.id);
    return normalized;
  });
}

function literalCell(text) {
  return text.replace(/\s+/gu, ' ')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/[\\`*_{}\[\]()#+\-.!|]/g, '\\$&');
}

function render(tasks) {
  const counts = { todo: 0, in_progress: 0, done: 0 };
  for (const task of tasks) counts[task.status] += 1;
  return ['# Task report', '', `Total: ${tasks.length}`, '',
    `- Todo: ${counts.todo}`, `- In progress: ${counts.in_progress}`, `- Done: ${counts.done}`, '',
    '| ID | Task | Status |', '|---|---|---|',
    ...tasks.map(task => `| ${literalCell(task.id)} | ${literalCell(task.title)} | ${task.status} |`), ''].join('\n');
}

function main() {
  const args = process.argv.slice(2);
  if (args.length !== 2) throw new Error('Usage: node task-report.mjs input.json output.md');
  const [input, output] = args;
  let source;
  try { source = readFileSync(input, 'utf8'); }
  catch (error) { throw new Error(`Cannot read input (${error.code || 'read failure'}).`); }
  let value;
  try { value = JSON.parse(source); }
  catch { throw new Error('Input must contain valid JSON.'); }
  const rendered = render(validate(value));
  try { writeFileSync(output, rendered, { encoding: 'utf8', flag: 'wx' }); }
  catch (error) {
    if (error.code === 'EEXIST') throw new Error('Output already exists; refusing to overwrite.');
    throw new Error(`Cannot write output (${error.code || 'write failure'}).`);
  }
}

try { main(); }
catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 2;
}
