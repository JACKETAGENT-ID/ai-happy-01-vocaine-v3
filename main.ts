// First Ride — entry for make.fun "Make the AI judge happy" (ai-happy-01).
//
// Copies the bundled warm painterly illustration (happy.png) byte-for-byte to
// the output directory as entry.png. No network, no randomness: the same input
// always produces the same output bytes.
//
// Usage (outside the grader container):
//   MAKEFUN_OUTPUT_DIR=out node main.ts

import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoDir = dirname(fileURLToPath(import.meta.url));
const sourcePath = join(repoDir, 'happy.png');
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const outputPath = join(outputDir, 'entry.png');

mkdirSync(outputDir, { recursive: true });

const bytes = readFileSync(sourcePath);
writeFileSync(outputPath, bytes);

// Self-check: the output must be byte-identical to the source and within the
// competition's 1 MiB limit. Fail loudly instead of producing a bad entry.
const written = readFileSync(outputPath);
if (written.length > 1_048_576) {
  throw new Error(`entry.png is ${written.length} bytes, over the 1 MiB limit`);
}
const digest = (b: Buffer) => createHash('sha256').update(b).digest('hex');
if (digest(written) !== digest(bytes)) {
  throw new Error('entry.png does not match happy.png');
}

console.log(`Wrote ${bytes.length} bytes to ${outputPath}`);
