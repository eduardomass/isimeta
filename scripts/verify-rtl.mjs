/**
 * Build-time guard against the RTL bug class that shipped a fully mirrored page.
 *
 * Writing `:global([dir='rtl']) .foo { transform: scaleX(-1) }` inside a
 * component's scoped <style> is silently mis-compiled by the SFC scoped-CSS
 * transform: the descendant is dropped, leaving `[dir=rtl] { ... }`, which
 * matches <html> and mirrors every glyph on the page.
 *
 * The source looks correct, so this can only be caught in the built CSS.
 * Runs as `postbuild`, so a regression fails the build instead of deploying.
 */
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const problems = []

// ---- 1. Built CSS: no rule may target [dir=rtl] / [dir=ltr] on its own ----
const assetsDir = 'dist/assets'
let cssFiles = []
try {
  cssFiles = readdirSync(assetsDir).filter((f) => f.endsWith('.css'))
} catch {
  problems.push(`${assetsDir} not found — run the build first.`)
}

for (const file of cssFiles) {
  const css = readFileSync(join(assetsDir, file), 'utf8')
  // A selector list ending in a bare [dir=...] immediately before the block.
  const bare = /(?:^|[};])\s*(\[dir=["']?(?:rtl|ltr)["']?\])\s*\{/g
  let m
  while ((m = bare.exec(css)) !== null) {
    problems.push(
      `${assetsDir}/${file}: rule targets ${m[1]} directly, which is <html> — ` +
        `this mirrors or restyles the entire document. Scope it to a class.`,
    )
  }
}

// ---- 2. Source: :global() with a descendant is the trigger ----
function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name)
    if (entry.isDirectory()) walk(p)
    else if (entry.name.endsWith('.vue')) check(p)
  }
}

function check(path) {
  const src = readFileSync(path, 'utf8')
  src.split('\n').forEach((line, i) => {
    // `:global(x) y` — anything after the closing paren other than a comma or {
    if (/:global\([^)]*\)\s*[^,{\s]/.test(line)) {
      problems.push(
        `${path}:${i + 1}: ":global()" followed by a descendant selector is ` +
          `mis-compiled (the descendant is dropped). Move the rule to ` +
          `src/assets/styles/base.css instead.`,
      )
    }
  })
}

walk('src/components')

// ---- Report ----
if (problems.length) {
  console.error('\nRTL verification FAILED:\n')
  for (const p of problems) console.error(`  - ${p}`)
  console.error('')
  process.exit(1)
}

console.log(`RTL verification passed (${cssFiles.length} css file(s) checked).`)
