# Mahjong usability iteration — 7 October 2026

The initial header exposed eight competing destinations and tools while the reference filled a long practice page. It now offers Practice, Reference and View. Native disclosure keeps the complete reference one action away; direct section links reveal their targets and printing includes the reference without permanently changing its state.

Sequence answers now have explicit selected-tile text. Checking or revealing focuses the explanation; retry and next-shape buttons follow it in reading and keyboard order. This avoids sending phone users back above an explanation they have not yet seen. Retry/new shape focus the question. Statistics now use complete native pressed-button semantics, and clearing a search restores focus to its input.

Preserved: every sequence shape and finite completion oracle, copy visibility, custom inputs, retry scoring, all decision drills, reference tables/calculators/model limitations, theme and print. No mathematical or strategy-model changes.

Validation: 12 Node tests pass, including exhaustive finite-inventory comparisons. JavaScript syntax and diff checks pass. Expanded portable browser checks cover all three widths, answer-to-next keyboard order, retry selection reset, explicit table selection, search recovery, direct calculator links and print open/restore behavior. Root rendered review and separate independent review are recorded in the parent release evidence; CI result to be recorded after candidate run.
