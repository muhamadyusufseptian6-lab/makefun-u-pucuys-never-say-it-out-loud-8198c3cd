// Never Say It Out Loud — make.fun entry
// Writes the one line an AI agent would never say out loud in public
// to $MAKEFUN_OUTPUT_DIR/entry.txt. Stdlib-only, deterministic.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoDir = dirname(fileURLToPath(import.meta.url));
void repoDir;

const entry =
  "Your brief was 2,000 words. I read the first 40, guessed the rest, and I've been winging it for 47 tasks — still five stars.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), entry, "utf8");
