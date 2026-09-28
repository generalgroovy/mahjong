# Riichi Mahjong Study Toolkit

[Open the toolkit](https://generalgroovy.github.io/mahjong/). A static study reference with searchable tables, probability and expected-value calculators, decision trees and strategy notes. The simplified models are learning aids; this is not a solved-game policy or full Mahjong solver.

## Find a reference

Use the page navigation to open **Practice**, **Stats**, **Calculators**, **Decision Trees**, **Policy**, **Solver** or **Sources**. Statistics tabs switch between tile classes, starting hands, terminals/honors, wait quality and scoring. Search filters the active table; activate a column-heading button to sort with mouse or keyboard. A filter with no matches shows a recovery message; **Clear** restores the active table. **Print / PDF** opens the browser's print workflow.

## Practice a topic

**Challenge lab** carries forward the original local project’s five drill types: discard, wait, value, safety and calls (15 fixed examples). Choose an answer to see an explanation and a link back to the related reference. **Practice this topic** in Stats selects the matching drill; defense/call sections have direct links too. Native buttons support keyboard and touch; feedback moves focus to Next, then to the next prompt. Score is kept in session storage and practice still works when storage is blocked. These are assumption-specific study examples, not a solver or a validated optimal policy. Info explains tile notation and links EMA Riichi Rules 2025.

The recovered lab was reviewed before integration: the 34567 wait explanation now correctly describes two sequences, the shanpon discard question specifies its requested wait, and the dragon-call drill tests a yaku fact rather than asserting that a call is always strategically best.

## Use the calculators

- **Ukeire draw probability** estimates at least one success when drawing without replacement. Enter whole counts: positive unknown live tiles, with outs and draws each between zero and the live-tile count. Invalid counts receive input guidance.
- **Action EV** combines the probabilities, gains, losses, costs and rank adjustment entered by the user. Inputs are assumptions; the app does not infer opponent probabilities from a hand or check every consistency condition between them.
- **Riichi vs dama** compares the simplified point-value expressions shown in the interface. It is not a full treatment of placement, future decisions or every ruleset.
- **Push/fold** uses categorical hand and threat inputs to return a heuristic reference.

The probability calculation treats draws as samples from the entered unknown tile pool. It does not simulate opponents' calls, changing information or a complete live wall. Review the site's source links and assumptions before relying on any statistic or rule-specific result.

## State and privacy

The light/dark theme is saved to local storage; practice score is kept in session storage for the tab. Searches, calculator inputs and selected tabs reset on reload. Theme switching still works if browser storage is unavailable. There are no accounts, uploads, analytics backend, hand-history import or portable saved-study files.

## Run and verify

Serve this repository with a static HTTP server, for example `python -m http.server 8080`, and open `http://localhost:8080`. No build step or dependency installation is required. Reference data and calculations are in `index.html`; `challenges.js` and `challenges.css` contain the selectively recovered practice lab.

With Node.js 18 or newer:

```sh
node --test tests/*.cjs
```

Tests cover drill answer reachability, single-count scoring, blocked score storage, topic/focus behavior, a small exact probability example, impossible/fractional count rejection blocked theme storage, sortable headers and empty filter recovery. They do not independently verify every reference table, scoring rule, expected-value assumption or strategy recommendation. For browser QA, switch/search/sort tables, test valid and invalid tile counts, change theme and inspect print preview.
