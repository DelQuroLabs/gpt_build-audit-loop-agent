// Deliberately flawed starter for the documented validation exercise.
// Its failures are seeded fixture defects, not measured model mistakes.
import { readFileSync, writeFileSync } from 'node:fs';
const [input, output] = process.argv.slice(2);
const tasks = JSON.parse(readFileSync(input, 'utf8'));
const lines = ['# Task report', '', `Total: ${tasks.length}`, '',
  `- Todo: ${tasks.filter(task => task.status === 'todo').length}`,
  '- In progress: 0',
  `- Done: ${tasks.filter(task => task.status !== 'todo').length}`, '',
  '| ID | Task | Status |', '|---|---|---|',
  ...tasks.map(task => `| ${task.id} | ${task.title} | ${task.status} |`), ''];
writeFileSync(output, lines.join('\n'), 'utf8');
