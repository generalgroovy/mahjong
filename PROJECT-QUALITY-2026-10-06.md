# Mahjong quality pass — 6 October 2026

Baseline: `156e152b35772e73e49d710264e05355fa7d621e`; clean checkout matching origin/main. Sole owner branch: `codex/mahjong-sequence-lab`.

## Plan and acceptance

Primary journey: try a short tile exercise, commit an answer, inspect why each tile works, then increase difficulty or bring a shape of your own. Existing practice repeats 15 fixed examples below long reference/calculator content. Preserve those examples and references while adding exact generated partial-shape practice first.

- A sequence-only exercise for 2, 5 or 8 tiles, explicitly distinguished from a whole winning hand. Select all available completions; explanations show exact sequence partitions and unseen-copy arithmetic.
- Bounded generated catalogues, optional visible tiles, custom shapes, retry and answer reveal. More reasoning through overlapping sequences, not a larger default control panel.
- Test all legal partial shapes with an independently enumerated partition oracle, inventory bounds, no fifth copies, finite generation, answer lifecycle and calculator bounds. Browser CI: desktop, phone, keyboard, settings, custom-shape recovery and old reference links.
- Fix issues found during verification; record actual evidence here before handoff.

## Rules and assumptions

[EMA Riichi Rules 2025](https://mahjong-europe.org/portal/images/docs/Riichi-rules-2025-EN.pdf), linked by the [EMA rules page](https://mahjong-europe.org/portal/index.php?Itemid=166&id=30&option=com_content&view=article), defines four copies of each tile type and sequences of three consecutive tiles of one suit. The new exercise uses only these combinatorial facts. It excludes pairs, triplets, honors, yaku, furiten, calls and other tiles in a full hand. Unseen copies may be in opponents' hands or the dead wall; they are not known live-wall outs or a draw probability. Existing strategy/reference content is preserved, not independently revalidated by this pass.

## Evidence

- Local: 12/12 Node tests pass; both runtime scripts and browser test script pass Node syntax checks. The independent oracle covers every legal 2-, 5- and 8-tile inventory (including shapes with no completion), reconstructs every returned partition, and tests zero remaining copies and impossible inventories.
- GitHub CI: [run 37539765379](https://github.com/generalgroovy/mahjong/actions/runs/37539765379) passed on runtime commit `f0ccf98`. All 12 model/regression tests plus real Chromium workflows at 1366×768, 390×844 and 320×844 passed with no page errors or document overflow. CI outputs are copied to `docs/evidence/2026-10-06/ci/`.
- Local CUA: observed 1366×768 and 320×844. Verified keyboard selection of 3m+6m for 45m; 34567m all three completions; wrong-answer retry does not inflate first-try accuracy; invalid five-copy custom input preserves the exercise; reveal works; no console errors or horizontal page overflow. Saved `desktop-start.png`, `desktop-multi-wait.png`, `phone-multi-wait.png`.
- Iteration: first browser run 37539633207 failed because the assertion expected mixed-case text while CSS transforms it to uppercase. Case-insensitive assertion fixed; application topic navigation itself was correct. Visual review also moved reference facts under Info and compressed the introduction so the default exercise appears sooner.
- Calculator audit: bounded the unknown pool at 136 to prevent huge input loops and removed chart rows whose number of draws exceeds the pool. A four-tile pool now shows only 1, 2 and 4 draws. Existing probability and storage tests still pass.
- Self-review: baseline-to-candidate diff preserves original 15 drills, source links, calculator formulas, theme/session storage and reference controls. New runtime uses native buttons/selects, explicit selected states, finite catalogues (15/88/306 shapes), no dependencies/network/storage, and text-only DOM insertion. Strict UTF-8 validation and diff whitespace checks passed.
- Not run: physical-device/screen-reader testing, beginner learner sessions, print-dialog inspection, and independent revalidation of all pre-existing table/strategy content. No solved-game, GTO, full-hand solver or learning-outcome claim.

## Parent release

Promote the reviewed candidate with a fast-forward and verify GitHub Pages. Runtime files: `index.html`, `challenges.css`, `challenges.js`, `sequence-model.js`, `sequence-lab.js`. No portfolio edits or main push were performed by this owner. Public link remains https://generalgroovy.github.io/mahjong/.
