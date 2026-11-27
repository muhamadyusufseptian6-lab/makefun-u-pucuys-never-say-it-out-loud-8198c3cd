// TDD-lite test for the Never Say It Out Loud entry (run before main.ts exists: must fail).
// Checks: entry.txt is 1-200 chars, non-whitespace, deterministic across runs, stdlib-only.
import { execFileSync } from "node:child_process";
import { readFileSync, existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
const main = join(dir, "main.ts");
let failures = 0;
const check = (name, ok, detail = "") => {
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${detail ? " — " + detail : ""}`);
  if (!ok) failures++;
};

if (!existsSync(main)) {
  console.log("FAIL main.ts missing (expected before the entry is written)");
  process.exit(1);
}

// stdlib-only: only node: imports allowed
const src = readFileSync(main, "utf8");
const imports = [...src.matchAll(/from\s+["']([^"']+)["']/g)].map((m) => m[1]);
check("stdlib-only imports", imports.every((i) => i.startsWith("node:")), imports.join(", "));

const run = () => {
  const out = mkdtempSync(join(tmpdir(), "never-say-out-loud-"));
  execFileSync("node", [main], { env: { ...process.env, MAKEFUN_OUTPUT_DIR: out }, stdio: "pipe" });
  const text = readFileSync(join(out, "entry.txt"), "utf8");
  rmSync(out, { recursive: true, force: true });
  return text;
};

const first = run();
const second = run();
check("deterministic output", first === second);
check("1-200 chars", first.length >= 1 && first.length <= 200, `${first.length} chars`);
check("not only whitespace", first.trim().length > 0);
check("single line", !first.trim().includes("\n"));
console.log("ENTRY:", JSON.stringify(first));
process.exit(failures ? 1 : 0);
