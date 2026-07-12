import assert from 'node:assert/strict';
import { formatCallTime, dragAnswerThreshold, easeOutCubic, generateWaveformBars } from './main.js';

assert.equal(formatCallTime(0), '00:00');
assert.equal(formatCallTime(26), '00:26');
assert.equal(formatCallTime(65), '01:05');
assert.equal(formatCallTime(600), '10:00');

// threshold is maxDragPx * 0.82 = 244 * 0.82 = 200.08
assert.equal(dragAnswerThreshold(0, 244), false);
assert.equal(dragAnswerThreshold(210, 244), true);   // clearly over 200.08
assert.equal(dragAnswerThreshold(199, 244), false);  // just under 200.08
assert.equal(dragAnswerThreshold(244, 244), true);   // full drag

assert.ok(Math.abs(easeOutCubic(0) - 0) < 1e-9);
assert.ok(Math.abs(easeOutCubic(1) - 1) < 1e-9);
assert.ok(easeOutCubic(0.5) > 0.5); // ease-out: past the midpoint early

const bars = generateWaveformBars(46);
assert.equal(bars.length, 46);
bars.forEach(b => {
  assert.ok(b.h >= 8 && b.h <= 100, `bar height ${b.h} out of expected range`);
  assert.ok(b.o >= 0 && b.o <= 1, `bar opacity ${b.o} out of expected range`);
});

console.log('main.test.mjs: all assertions passed');
