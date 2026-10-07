# Mahjong usability iteration — 7 October 2026

The initial header exposed eight competing destinations and tools while the reference filled a long practice page. It now offers Practice, Reference and View. Native disclosure keeps the complete reference one action away; direct section links reveal their targets and printing includes the reference without permanently changing its state.

Sequence answers now have explicit selected-tile text. Checking or revealing focuses the explanation; retry and next-shape buttons follow it in reading and keyboard order. This avoids sending phone users back above an explanation they have not yet seen. Retry/new shape focus the question. Statistics now use complete native pressed-button semantics, and clearing a search restores focus to its input.

Preserved: every sequence shape and finite completion oracle, copy visibility, custom inputs, retry scoring, all decision drills, reference tables/calculators/model limitations, theme and print. No mathematical or strategy-model changes.

Validation: 12 Node tests pass, including exhaustive finite-inventory comparisons. JavaScript syntax and diff checks pass. [CI 37601275663](https://github.com/generalgroovy/mahjong/actions/runs/37601275663) passed all three widths, answer-to-next keyboard order, retry selection reset, explicit table selection, search recovery, direct calculator links and print open/restore behavior. Root CUA inspected 1366x900 and 320x740: selected choices, correct-answer focus and Tab-to-next, retained exercise after reference navigation, direct calculator links, and revealed answers with adjacent retry/next on phone. No document overflow. The separate ux_midi reviewer read the full runtime diff, independently passed 12 tests and found no blocker. Project release evidence retains the full review.

Print scope: the new Reference parent opens for printing and restores afterwards. Existing nested topic disclosures retain their existing print behavior; this is not a claim that every closed topic is expanded. Automated checks do not prove human learning outcomes or independently validate all historical strategy material.
