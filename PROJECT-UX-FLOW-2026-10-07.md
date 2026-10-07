# Mahjong correction flow — 7 October 2026

Baseline: `276d27f2e8fbc2f65c93d1ac737cfb91b8c6745f`, the clean prior accepted checkout and current upstream main at inspection. Candidate branch: `codex/ux-flow-2026-10-07`. Intended public URL: https://generalgroovy.github.io/mahjong/. This candidate is not publication.

Observed friction: checking an incomplete answer immediately exposed every correct completion and its partition. The subsequent retry reset all choices, so the learner could only recall an already exposed answer. The new correction flow keeps missing answers hidden and preserves the learner's partial work.

Check tiles reports how many available tile types were found, then explains selected tiles that cannot make sequences, would need a fifth copy, or complete the shape but have zero unseen copies. Keep working preserves the selection, including None left, and returns focus to the question. Show me remains an explicit route to the complete worked solution. It sits beside the feedback and correction action so keyboard users reach it naturally. Solving or revealing shows the existing full partitions and copy arithmetic. Retrying a revealed solution clears choices. New shape remains available after a check or reveal.

The first check or reveal counts the shape once. Later corrections cannot increase first-try accuracy, and a corrected success explains that explicitly. The finite sequence model, reference data, calculators and strategy drills are unchanged. There are no new dependencies or saved-state changes.

Owner validation: 17 Node tests passed on Windows, including the exhaustive independent completion oracle and five new correction-flow cases. JavaScript syntax and diff checks passed. The new cases cover incomplete selections without answer disclosure, invalid versus exhausted choices, None left recovery, reveal after an error, first-try accounting, fifth-copy guidance and next-shape reset. Existing browser CI now checks preserved selections, hidden missing answers, focused feedback and Tab-to-Keep-working at 1366, 390 and 320 pixels; it also captures complete page screenshots of the correction state.

Review and rendered acceptance are separate gates coordinated by root. Browser CI, independent source review and root rendered acceptance have not yet completed for this candidate. No local browser automation was run by the owner. Automated checks do not establish human learning outcomes or independently validate historical strategy claims.
