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

Pending implementation and checks.
