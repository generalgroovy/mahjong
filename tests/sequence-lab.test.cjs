const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const model = require('../sequence-model.js');
const source = fs.readFileSync(path.join(__dirname, '..', 'sequence-lab.js'), 'utf8');

function setup(generated) {
  const elements = new Map();
  let focused;
  function node() {
    let text = '';
    const classes = new Set();
    return {
      children: [], dataset: {}, value: '', checked: false, hidden: false, disabled: false,
      classList: { toggle(name, on) { on ? classes.add(name) : classes.delete(name); }, contains(name) { return classes.has(name); } },
      get textContent() { return text + this.children.map(child => child.textContent).join(' '); },
      set textContent(value) { text = value; this.children = []; },
      replaceChildren() { this.children = []; text = ''; },
      appendChild(child) { this.children.push(child); },
      setAttribute(name, value) { this[name] = value; },
      addEventListener(event, handler) { this[event] = handler; },
      querySelectorAll() { return this.children; },
      focus() { focused = this; }
    };
  }
  function get(id) { if (!elements.has(id)) elements.set(id, node()); return elements.get(id); }
  get('sequenceSuit').value = 'm'; get('sequenceLevel').value = '1';
  const context = vm.createContext({
    SequenceModel: { ...model, ...(generated ? { generate: () => generated } : {}) },
    document: { getElementById: get, createElement: node }
  });
  vm.runInContext(source, context);
  function click(id) { const el = typeof id === 'string' ? get(id) : id; assert.equal(el.disabled, false); el.click(); }
  function choose(rank) { click(get('sequenceOptions').children[rank - 1]); }
  function custom(shape) { get('sequenceCustom').value = shape; get('sequenceCustomForm').submit({ preventDefault() {} }); }
  return { get, click, choose, custom, text: () => get('sequenceFeedback').textContent, focused: () => focused };
}

test('incomplete answers preserve choices for correction without exposing missing tiles or inflating accuracy', () => {
  const app = setup();
  app.choose(3); app.click('sequenceCheck');
  assert.match(app.text(), /1 of 2 completing tile types found\. 1 more to find/);
  assert.doesNotMatch(app.text(), /6m|Answer:|345m/);
  assert.ok(app.get('sequenceOptions').children.every(el => !el.classList.contains('correct')));
  assert.equal(app.focused(), app.get('sequenceFeedback'));
  assert.equal(app.get('sequenceReveal').hidden, false);
  app.click('sequenceRetry');
  assert.equal(app.focused(), app.get('sequencePrompt'));
  assert.equal(app.get('sequenceSelection').textContent, 'Selected: 3m.');
  assert.equal(app.get('sequenceOptions').children[2]['aria-pressed'], 'true');
  app.choose(6); app.click('sequenceCheck');
  assert.match(app.text(), /Answer: 3m, 6m · 8 unseen copies/);
  assert.match(app.text(), /Solved after another try/);
  assert.equal(app.get('sequenceScore').textContent, '0 / 1 correct on first try');
});

test('wrong selected tiles explain the difference between an invalid shape and exhausted copies', () => {
  const visible = Array(9).fill(0); visible[1] = 4;
  const app = setup({ counts: model.parseShape('34567'), visible });
  app.get('sequenceVisible').checked = true; app.get('sequenceVisible').change();
  for (const rank of [2, 5, 9]) app.choose(rank);
  app.click('sequenceCheck');
  assert.match(app.text(), /2m completes the shape, but has no unseen copies: 4 − 0 here − 4 seen = 0/);
  assert.match(app.text(), /9m cannot split all these tiles into sequences/);
  assert.doesNotMatch(app.text(), /8m|Answer:/);
  app.click('sequenceRetry'); app.choose(2); app.choose(9); app.choose(8); app.click('sequenceCheck');
  assert.match(app.text(), /Answer: 5m, 8m · 7 unseen copies/);
  assert.equal(app.get('sequenceScore').textContent, '0 / 1 correct on first try');
});

test('None left corrections remain exclusive and zero-completion shapes can be recovered', () => {
  const app = setup();
  app.click('sequenceNone'); app.click('sequenceCheck');
  assert.match(app.text(), /0 of 2 completing tile types found/);
  app.click('sequenceRetry');
  assert.equal(app.get('sequenceNone')['aria-pressed'], 'true');
  app.choose(3);
  assert.equal(app.get('sequenceNone')['aria-pressed'], 'false');
  app.choose(6); app.click('sequenceCheck');
  app.custom('11'); app.choose(2); app.click('sequenceCheck');
  assert.match(app.text(), /choose None left/);
  app.click('sequenceRetry'); app.click('sequenceNone'); app.click('sequenceCheck');
  assert.match(app.text(), /Answer: None left/);
  assert.equal(app.get('sequenceScore').textContent, '0 / 2 correct on first try');
});

test('explicit reveal after a mistake shows the full solution once and retry starts with clear choices', () => {
  const app = setup();
  app.choose(1); app.click('sequenceCheck'); app.click('sequenceReveal');
  assert.match(app.text(), /Here is how it works/);
  assert.match(app.text(), /345m/);
  assert.match(app.text(), /456m/);
  assert.equal(app.get('sequenceScore').textContent, '0 / 1 correct on first try');
  app.click('sequenceRetry');
  assert.equal(app.get('sequenceSelection').textContent, 'No tiles selected.');
  assert.equal(app.get('sequenceCheck').disabled, true);
  app.choose(3); app.choose(6); app.click('sequenceCheck');
  assert.equal(app.get('sequenceScore').textContent, '0 / 1 correct on first try');
});

test('a held four-copy tile is explained accurately and the next shape starts a new attempt', () => {
  const app = setup({ counts: model.parseShape('45'), visible: Array(9).fill(0) });
  app.custom('11112345'); app.choose(1); app.click('sequenceCheck');
  assert.match(app.text(), /1m is already here four times\. A fifth copy is not possible/);
  app.click('sequenceNext');
  assert.equal(app.get('sequenceSelection').textContent, 'No tiles selected.');
  app.choose(3); app.choose(6); app.click('sequenceCheck');
  assert.equal(app.get('sequenceScore').textContent, '1 / 2 correct on first try');
});
