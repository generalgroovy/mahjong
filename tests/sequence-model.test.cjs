const { test } = require('node:test');
const assert = require('node:assert/strict');
const model = require('../sequence-model.js');

// Independent oracle: enumerate all combinations of sequences and index their
// completed tile inventories. No use of the production partition algorithm.
function completedInventories(groups) {
  let inventories = [Array(9).fill(0)];
  for (let g = 0; g < groups; g++) {
    const next = [];
    for (const counts of inventories) for (let first = 0; first < 7; first++) {
      const result = [...counts];
      for (let rank = first; rank < first + 3; rank++) result[rank]++;
      if (result.every(n => n <= 4)) next.push(result);
    }
    inventories = next;
  }
  return new Set(inventories.map(c => c.join('')));
}
function allCounts(size, visit, counts = [], left = size) {
  if (counts.length === 9) { if (!left) visit(counts); return; }
  for (let n = 0; n <= Math.min(4, left); n++) allCounts(size, visit, [...counts, n], left - n);
}
test('all legal 2-, 5-, and 8-tile shapes agree with an independent completion oracle', () => {
  for (const groups of [1, 2, 3]) {
    const complete = completedInventories(groups);
    allCounts(groups * 3 - 1, counts => {
      const expected = [];
      for (let rank = 1; rank <= 9; rank++) {
        if (counts[rank - 1] === 4) continue;
        const added = [...counts]; added[rank - 1]++;
        if (complete.has(added.join(''))) expected.push(rank);
      }
      const actual = model.analyze(counts);
      assert.deepEqual(actual.map(w => w.rank), expected, counts.join(''));
      for (const wait of actual) {
        const reconstructed = Array(9).fill(0);
        for (const group of wait.groups) for (const rank of group) reconstructed[rank - 1]++;
        const completed = [...counts]; completed[wait.rank - 1]++;
        assert.deepEqual(reconstructed, completed);
      }
    });
  }
});
test('overlapping waits explain all completions and account for held and visible copies', () => {
  const counts = model.parseShape('34567'), seen = Array(9).fill(0);
  seen[1] = 4; seen[4] = 2; seen[7] = 1;
  const waits = model.analyze(counts, seen);
  assert.deepEqual(waits.map(({rank, remaining}) => [rank, remaining]), [[2, 0], [5, 1], [8, 3]]);
  assert.equal(model.check(waits, [5, 8]), true);
  assert.equal(model.check(waits, [2, 5, 8]), false);
  assert.equal(model.check(waits, [5]), false);
  assert.equal(model.check(waits, [5, 8, 9]), false);
});
test('generated catalogues contain unique reachable shapes and never repeat immediately', () => {
  for (const groups of [1, 2, 3]) {
    const list = model.catalogue(groups);
    assert.equal(new Set(list.map(c => c.join(''))).size, list.length);
    assert.ok(list.length > 10);
    list.forEach(c => assert.ok(model.analyze(c).length > 0));
    const first = model.generate(groups, true, '', () => 0.99);
    const second = model.generate(groups, true, first.counts.join(''), () => 0.99);
    assert.notDeepEqual(second.counts, first.counts);
    first.visible.forEach((n, i) => assert.ok(n + first.counts[i] <= 4));
    assert.equal(model.check(model.analyze(first.counts, first.visible), []), true);
    list[0][0] = 99;
    assert.notEqual(model.catalogue(groups)[0][0], 99);
  }
});
test('custom inputs reject malformed, oversized and impossible inventories, with no fifth-tile completion', () => {
  for (const text of ['', '1', '1234', '00', '1m2m', '11111234', '12345678901', '<script>']) assert.throws(() => model.parseShape(text));
  assert.deepEqual(model.ranks(model.parseShape(' 3 4 5 6 7 ')), [3,4,5,6,7]);
  assert.throws(() => model.analyze(Array(9).fill(0)));
  assert.throws(() => model.analyze(model.parseShape('45'), [0,0,0,4,0,0,0,0,0]));
  assert.throws(() => model.catalogue(4));
  assert.equal(model.analyze(model.parseShape('11112345')).some(w => w.rank === 1), false);
});
