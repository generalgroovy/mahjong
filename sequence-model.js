(function (root) {
  'use strict';
  const empty = () => Array(9).fill(0);
  function validCounts(counts) {
    return Array.isArray(counts) && counts.length === 9 && counts.every(n => Number.isInteger(n) && n >= 0 && n <= 4);
  }
  function parseShape(text) {
    const digits = String(text).replace(/\s/g, '');
    if (!/^[1-9]+$/.test(digits) || ![2, 5, 8].includes(digits.length)) {
      throw new Error('Enter 2, 5 or 8 numbers from 1 to 9, all from one suit. Example: 34567.');
    }
    const counts = empty();
    for (const digit of digits) counts[Number(digit) - 1]++;
    if (!validCounts(counts)) throw new Error('There are only four copies of each tile. Change the repeated number.');
    return counts;
  }
  function ranks(counts) {
    return counts.flatMap((count, index) => Array(count).fill(index + 1));
  }
  function partition(counts) {
    const rest = [...counts], groups = [];
    // The lowest remaining rank must begin a sequence in this sequence-only model.
    for (let rank = 0; rank < 9; rank++) {
      while (rest[rank]) {
        if (rank > 6 || !rest[rank + 1] || !rest[rank + 2]) return null;
        rest[rank]--; rest[rank + 1]--; rest[rank + 2]--;
        groups.push([rank + 1, rank + 2, rank + 3]);
      }
    }
    return groups;
  }
  function analyze(counts, visible = empty()) {
    if (!validCounts(counts) || ![2, 5, 8].includes(counts.reduce((a, b) => a + b, 0))) throw new Error('Invalid partial shape.');
    if (!validCounts(visible) || visible.some((n, i) => n + counts[i] > 4)) throw new Error('Visible and held tiles exceed four copies.');
    const waits = [];
    counts.forEach((count, index) => {
      if (count === 4) return;
      const completed = [...counts]; completed[index]++;
      const groups = partition(completed);
      if (groups) waits.push({ rank: index + 1, groups, remaining: 4 - count - visible[index] });
    });
    return waits;
  }
  const catalogues = new Map();
  function catalogue(groups) {
    if (![1, 2, 3].includes(groups)) throw new Error('Choose one, two or three sequences.');
    if (catalogues.has(groups)) return catalogues.get(groups).map(c => [...c]);
    const unique = new Map();
    function addSequences(counts, remaining, start) {
      if (!remaining) {
        counts.forEach((count, index) => {
          if (!count) return;
          const partial = [...counts]; partial[index]--;
          unique.set(partial.join(''), partial);
        });
        return;
      }
      for (let first = start; first <= 6; first++) {
        const next = [...counts]; next[first]++; next[first + 1]++; next[first + 2]++;
        if (next.every(n => n <= 4)) addSequences(next, remaining - 1, first);
      }
    }
    addSequences(empty(), groups, 0);
    const result = [...unique.values()];
    catalogues.set(groups, result);
    return result.map(c => [...c]);
  }
  function generate(groups, showVisible = false, previous = '', random = Math.random) {
    const choices = catalogue(groups).filter(c => c.join('') !== previous);
    const pick = n => Math.min(n - 1, Math.max(0, Math.floor(random() * n) || 0));
    const counts = choices[pick(choices.length)];
    const visible = counts.map(n => showVisible ? pick(5 - n) : 0);
    return { counts, visible };
  }
  function check(waits, selected) {
    const expected = waits.filter(w => w.remaining > 0).map(w => w.rank);
    const choices = [...new Set(selected)];
    return expected.length === choices.length && choices.every(rank => expected.includes(rank));
  }
  const api = { parseShape, ranks, analyze, catalogue, generate, check };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SequenceModel = api;
})(typeof globalThis === 'undefined' ? this : globalThis);
