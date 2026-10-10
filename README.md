# Riichi Mahjong Study Toolkit

[Open the toolkit](https://generalgroovy.github.io/mahjong/). Practice partial tile shapes and decisions; reference searchable tables, probability and expected-value calculators, and strategy notes. The simplified models are learning aids; this is not a solved-game policy or full Mahjong solver.

## Find a reference

Start in **Practice**. Open **Reference** for statistics, calculators, decision trees, strategy notes, model limits and sources. The reference library starts folded so the exercise stays in view; existing section links open the right material directly. Statistics buttons select tile classes, starting hands, terminals/honors, wait quality or scoring and announce which table is selected. Search filters the active table; activate a column-heading button to sort with mouse or keyboard. **Clear** restores the table and returns focus to search. **View** contains theme and **Print / PDF**; printing includes the reference and then restores its open/closed state.

## Practice a shape

**Sequence builder** starts with `45m`. Select **every** tile that can complete the shape, then **Check tiles**. A short selection line names your choices. An incomplete or wrong answer tells you how many completing tile types you found and explains selected tiles that do not work, including exhausted copies. Missing tiles stay hidden. **Keep working** returns to the question with your choices kept, so you can add or remove tiles and check again.

Solve the shape or choose **Show me** to see the full answer, each sequence partition and the number of copies still unseen. After a reveal, **Try again** clears the choices for another attempt. Checking and revealing focus the feedback, with the next actions directly after it in keyboard order. Each shape counts toward first-try accuracy once; a correction or reveal never increases that score. **New shape** generates a different inventory from the current level and returns focus to the question.

Under **Change the exercise**, build one, two or three sequences (2, 5 or 8 tiles), choose a suit, or add visible tiles. The generator has 15, 88 and 306 distinct shapes respectively, with no immediate repeated inventory. Visible counts never exceed the four-copy limit together with held tiles. A completion with no unseen copies must not be selected; choose **None left** when no completion remains. Enter your own ranks, such as `34567`, to study a specific shape; invalid input preserves the current exercise. Custom shapes reset visible counts.

The exercise deliberately tests **partial shapes and sequences only**. It does not solve a complete winning hand, pairs, triplets, yaku, furiten or strategy. “Unseen” does not mean known to be in the live wall. Settings, generated exercises and sequence accuracy reset on reload; no data is uploaded.

## Practice a decision

Expand **Decision drills** for discard, wait, value, safety and call questions (15 fixed examples). Choose an answer for its explanation and related reference. **Practice this topic** in Stats opens the matching drill; defense/call sections link directly too. These are assumption-specific study examples, not validated optimal policies. The original scenario score is kept in session storage, and drills remain usable if storage is blocked. Info explains notation and links EMA Riichi Rules 2025.

## Use the calculators

- **Ukeire draw probability** estimates at least one success when drawing without replacement. Enter whole counts: 1–136 unknown live tiles, with outs and draws each between zero and the live-tile count. Invalid counts receive input guidance.
- **Action EV** combines the probabilities, gains, losses, costs and rank adjustment entered by the user. Inputs are assumptions; the app does not infer opponent probabilities from a hand or check every consistency condition between them.
- **Riichi vs dama** compares the simplified point-value expressions shown in the interface. It is not a full treatment of placement, future decisions or every ruleset.
- **Push/fold** uses categorical hand and threat inputs to return a heuristic reference.

The probability calculation treats draws as samples from the entered unknown tile pool. It does not simulate opponents' calls, changing information or a complete live wall. Review the site's source links and assumptions before relying on any statistic or rule-specific result.

## State and privacy

The light/dark theme is saved to local storage; practice score is kept in session storage for the tab. Searches, calculator inputs and selected tabs reset on reload. Theme switching still works if browser storage is unavailable. Sequence-builder progress is kept only in memory and resets on reload. There are no accounts, uploads, analytics backend, hand-history import or portable saved-study files.

## Run and verify

Serve this repository with a static HTTP server, for example `python -m http.server 8080`, and open `http://localhost:8080`. No build step or dependency installation is required. Reference data and calculations are in `index.html`; `challenges.js` contains the fixed drills, `sequence-model.js` contains the pure sequence model, `sequence-lab.js` handles its controls, and `challenges.css` styles both.

With Node.js 18 or newer:

```sh
node --test tests/*.cjs
```

The 17 Node tests cover every legal 2-, 5- and 8-tile inventory against an independent sequence-combination oracle; decomposition reconstruction; visibility/copy limits; unique bounded generation; malformed custom shapes; correction without revealing missing tiles; preserved choices and explicit reveal; first-try scoring/focus; probability bounds; blocked storage; and reference sort/filter recovery. GitHub Actions additionally exercises real Chromium at 1366, 390 and 320 pixels: keyboard answers, partial-answer recovery, custom-shape errors, retry accuracy, all difficulty levels, visible tiles, suit changes, no-completion shapes, fixed-drill navigation and probability output. Historical browser screenshots and the quality record are in `docs/evidence/2026-10-06/` and `PROJECT-QUALITY-2026-10-06.md`; the current correction-flow record is `PROJECT-UX-FLOW-2026-10-07.md`.

These checks do not independently validate every existing reference table, scoring rule, strategy recommendation or human learning outcome. No build step or runtime dependency is added; Playwright is installed only in CI for browser regression.
