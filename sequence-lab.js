(() => {
  'use strict';
  const model = SequenceModel;
  const $ = id => document.getElementById(id);
  let current, selected = new Set(), answered = false, counted = false, solutionShown = false;
  let attempted = 0, correct = 0;
  const suit = () => $('sequenceSuit').value;
  const tile = rank => `${rank}${suit()}`;
  function describeSelection(none = false) {
    $('sequenceSelection').textContent = none ? 'Selected: None left.' : selected.size
      ? `Selected: ${[...selected].sort((a, b) => a - b).map(tile).join(', ')}.`
      : 'No tiles selected.';
  }
  function start(next) {
    current = next; counted = false;
    $('sequenceCustomError').textContent = '';
    render();
  }
  function render() {
    selected = new Set(); answered = false; solutionShown = false;
    const groups = (current.counts.reduce((a, b) => a + b, 0) + 1) / 3;
    $('sequencePrompt').textContent = `Which tiles complete ${groups === 1 ? 'one sequence' : `${groups} sequences`}?`;
    $('sequenceHand').replaceChildren();
    model.ranks(current.counts).forEach(rank => {
      const el = document.createElement('span'); el.className = `tile suit-${suit()}`; el.textContent = tile(rank);
      $('sequenceHand').appendChild(el);
    });
    $('sequenceOptions').replaceChildren();
    for (let rank = 1; rank <= 9; rank++) {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'sequence-choice'; button.dataset.rank = rank;
      button.textContent = tile(rank); button.setAttribute('aria-pressed', 'false');
      if ($('sequenceVisible').checked) {
        const count = document.createElement('small'); count.textContent = `${current.visible[rank - 1]} seen`;
        button.appendChild(count);
      }
      button.addEventListener('click', () => {
        if (answered) return;
        if (selected.has(rank)) selected.delete(rank); else selected.add(rank);
        button.setAttribute('aria-pressed', String(selected.has(rank)));
        $('sequenceNone').setAttribute('aria-pressed', 'false');
        $('sequenceCheck').disabled = !selected.size;
        describeSelection();
      });
      $('sequenceOptions').appendChild(button);
    }
    $('sequenceNone').setAttribute('aria-pressed', 'false'); $('sequenceNone').disabled = false;
    describeSelection();
    $('sequenceCheck').disabled = true; $('sequenceCheck').hidden = false;
    $('sequenceReveal').hidden = false; $('sequenceRetry').hidden = true;
    $('sequenceNext').hidden = true;
    $('sequenceFeedback').replaceChildren();
    $('sequenceFeedback').textContent = 'Select every tile that works and has a copy unseen. Check tiles gives feedback; Show me reveals the full answer.';
  }
  function finish(reveal = false) {
    if ((answered && (!reveal || solutionShown)) || (!reveal && $('sequenceCheck').disabled)) return;
    answered = true;
    const waits = model.analyze(current.counts, current.visible);
    const success = !reveal && model.check(waits, selected);
    const firstAttempt = !counted;
    if (!counted) { attempted++; if (success) correct++; counted = true; }
    $('sequenceScore').textContent = `${correct} / ${attempted} correct on first try`;
    const feedback = $('sequenceFeedback'); feedback.replaceChildren();
    const heading = document.createElement('h4'); heading.className = 'feedback-status';
    heading.textContent = reveal ? 'Here is how it works' : success ? 'Every tile found' : 'Keep working on this shape';
    feedback.appendChild(heading);
    solutionShown = reveal || success;
    if (!solutionShown) {
      showCorrection(feedback, waits);
    } else {
      showSolution(feedback, waits);
      if (success && !firstAttempt) {
        const note = document.createElement('p');
        note.textContent = 'Solved after another try. Your first-try score stays the same.';
        feedback.appendChild(note);
      }
    }
    $('sequenceOptions').querySelectorAll('button').forEach(button => {
      const rank = Number(button.dataset.rank);
      button.disabled = true;
      button.classList.toggle('correct', solutionShown && waits.some(w => w.rank === rank && w.remaining > 0));
    });
    $('sequenceNone').disabled = true;
    $('sequenceCheck').hidden = true; $('sequenceReveal').hidden = solutionShown;
    $('sequenceRetry').textContent = solutionShown ? 'Try again' : 'Keep working';
    $('sequenceRetry').hidden = success; $('sequenceNext').hidden = false;
    feedback.focus();
  }
  function showCorrection(feedback, waits) {
    const available = waits.filter(w => w.remaining > 0);
    const found = available.filter(w => selected.has(w.rank)).length;
    const missing = available.length - found;
    const summary = document.createElement('p');
    summary.textContent = `${found} of ${available.length} completing tile types found. ${missing ? `${missing} more to find.` : 'Remove the choices that do not work.'}`;
    feedback.appendChild(summary);
    const extras = [...selected].filter(rank => !available.some(w => w.rank === rank));
    if (extras.length) {
      const list = document.createElement('ul'); list.className = 'sequence-explanations';
      extras.forEach(rank => {
        const item = document.createElement('li');
        const exhausted = waits.some(w => w.rank === rank);
        item.textContent = exhausted
          ? `${tile(rank)} completes the shape, but has no unseen copies: 4 − ${current.counts[rank - 1]} here − ${current.visible[rank - 1]} seen = 0. Remove it.`
          : current.counts[rank - 1] === 4
            ? `${tile(rank)} is already here four times. A fifth copy is not possible. Remove it.`
            : `${tile(rank)} cannot split all these tiles into sequences. Remove it.`;
        list.appendChild(item);
      });
      feedback.appendChild(list);
    }
    const hint = document.createElement('p');
    hint.textContent = available.length
      ? 'Keep working keeps your choices so you can adjust them. The missing tiles stay hidden until you solve it or choose Show me.'
      : 'No completing tile has an unseen copy. Keep working, then choose None left.';
    feedback.appendChild(hint);
  }
  function showSolution(feedback, waits) {
    const expected = waits.filter(w => w.remaining > 0).map(w => tile(w.rank));
    const summary = document.createElement('p');
    summary.textContent = expected.length ? `Answer: ${expected.join(', ')} · ${waits.reduce((sum, w) => sum + w.remaining, 0)} unseen copies in total.` : 'Answer: None left. No completing tile has an unseen copy.';
    feedback.appendChild(summary);
    const list = document.createElement('ul'); list.className = 'sequence-explanations';
    waits.forEach(wait => {
      const item = document.createElement('li');
      item.textContent = `${tile(wait.rank)} → ${wait.groups.map(group => `${group.join('')}${suit()}`).join(' + ')}. ${wait.remaining} unseen = 4 − ${current.counts[wait.rank - 1]} here − ${current.visible[wait.rank - 1]} seen.`;
      list.appendChild(item);
    });
    if (!waits.length) {
      const item = document.createElement('li'); item.textContent = 'No single tile can split this shape into sequences. Try a different shape.'; list.appendChild(item);
    }
    const extras = [...selected].filter(rank => !waits.some(w => w.rank === rank && w.remaining > 0));
    if (extras.length) {
      const item = document.createElement('li');
      item.textContent = `${extras.map(tile).join(', ')}: ${extras.length === 1 ? 'this choice does' : 'these choices do'} not complete the sequences with an unseen copy.`;
      list.appendChild(item);
    }
    feedback.appendChild(list);
  }
  function retry() {
    if (solutionShown) render();
    else {
      answered = false;
      $('sequenceOptions').querySelectorAll('button').forEach(button => { button.disabled = false; });
      $('sequenceNone').disabled = false;
      $('sequenceCheck').hidden = false;
      $('sequenceRetry').hidden = true; $('sequenceNext').hidden = true;
      $('sequenceFeedback').textContent = 'Your choices are kept. Add or remove tiles, then check again. This shape has already counted toward your first-try score.';
    }
    $('sequencePrompt').focus();
  }
  function next() {
    start(model.generate(Number($('sequenceLevel').value), $('sequenceVisible').checked, current?.counts.join('')));
  }
  $('sequenceNone').addEventListener('click', () => {
    if (answered) return;
    selected.clear();
    $('sequenceOptions').querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', 'false'));
    $('sequenceNone').setAttribute('aria-pressed', 'true'); $('sequenceCheck').disabled = false;
    describeSelection(true);
  });
  $('sequenceCheck').addEventListener('click', () => finish());
  $('sequenceReveal').addEventListener('click', () => finish(true));
  $('sequenceRetry').addEventListener('click', retry);
  $('sequenceNext').addEventListener('click', () => { next(); $('sequencePrompt').focus(); });
  ['sequenceLevel', 'sequenceVisible'].forEach(id => $(id).addEventListener('change', next));
  $('sequenceSuit').addEventListener('change', () => { render(); });
  $('sequenceCustomForm').addEventListener('submit', event => {
    event.preventDefault();
    try {
      const counts = model.parseShape($('sequenceCustom').value);
      $('sequenceLevel').value = String((model.ranks(counts).length + 1) / 3);
      // A custom shape starts with no visible tiles so it cannot inherit an impossible inventory.
      $('sequenceVisible').checked = false;
      start({ counts, visible: Array(9).fill(0) });
      $('sequencePrompt').focus({ preventScroll: true });
    } catch (error) { $('sequenceCustomError').textContent = error.message; $('sequenceCustom').focus(); }
  });
  // A predictable two-sided shape teaches the interaction before randomized practice.
  start({ counts: model.parseShape('45'), visible: Array(9).fill(0) });
})();
