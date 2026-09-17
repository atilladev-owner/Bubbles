import { describe, expect, it } from 'vitest';
import { halve, measured } from './measure';

describe('halve', () => {
  it('halves a whole gram figure to a half', () => {
    expect(halve('83g')).toEqual({ value: '41.5g', asWritten: false });
  });

  it('halves a whole gram figure to a whole', () => {
    expect(halve('100g')).toEqual({ value: '50g', asWritten: false });
  });

  it('keeps the text after the number', () => {
    expect(halve('1 bottle')).toEqual({ value: '0.5 bottle', asWritten: false });
  });

  it('halves a bare number', () => {
    expect(halve('4')).toEqual({ value: '2', asWritten: false });
  });

  it('rounds a quarter up to the nearest half', () => {
    // 1.5 halves to 0.75, which sits exactly between 0.5 and 1, so it rounds to 1.
    expect(halve('1.5')).toEqual({ value: '1', asWritten: false });
  });

  it('rounds a half bottle up to the nearest half', () => {
    // 0.5 halves to 0.25, which sits exactly between 0 and 0.5, so it rounds to 0.5.
    expect(halve('0.5 bottle')).toEqual({ value: '0.5 bottle', asWritten: false });
  });

  it('ignores whitespace padding', () => {
    expect(halve('   83g   ')).toEqual({ value: '41.5g', asWritten: false });
  });

  it('halves a very large figure', () => {
    expect(halve('1000000g')).toEqual({ value: '500000g', asWritten: false });
  });

  it('halves a large figure with a decimal', () => {
    expect(halve('12345.5g')).toEqual({ value: '6173g', asWritten: false });
  });

  it('leaves the empty string as written', () => {
    expect(halve('')).toEqual({ value: '', asWritten: true });
  });

  it('leaves a blank as written', () => {
    expect(halve('   ')).toEqual({ value: '   ', asWritten: true });
  });

  it('leaves a count as written', () => {
    expect(halve('1ea')).toEqual({ value: '1ea', asWritten: true });
  });

  it('leaves a length as written', () => {
    expect(halve('10cm')).toEqual({ value: '10cm', asWritten: true });
  });

  it('leaves a count carrying a length as written', () => {
    expect(halve('2ea (10cm)')).toEqual({ value: '2ea (10cm)', asWritten: true });
  });

  it('halves a measure in shots', () => {
    expect(halve('2 shots')).toEqual({ value: '1 shots', asWritten: false });
  });

  it('leaves a count of slices as written', () => {
    expect(halve('4 slices')).toEqual({ value: '4 slices', asWritten: true });
  });

  it('leaves a wedge as written', () => {
    expect(halve('1 wedge')).toEqual({ value: '1 wedge', asWritten: true });
  });

  it('leaves a fraction of a count as written', () => {
    expect(halve('1/2ea')).toEqual({ value: '1/2ea', asWritten: true });
  });

  it('leaves a word as written', () => {
    expect(halve('to taste')).toEqual({ value: 'to taste', asWritten: true });
  });

  it('leaves a value that does not start with a number as written', () => {
    expect(halve('about 80g')).toEqual({ value: 'about 80g', asWritten: true });
  });

  it('leaves a ratio as written', () => {
    expect(halve('1/2')).toEqual({ value: '1/2', asWritten: true });
  });

  it('is pure and does not touch its input', () => {
    const input = '83g';
    halve(input);
    expect(input).toBe('83g');
  });
});

describe('measured', () => {
  it('shows a figure exactly as she typed it on Full, and never marks it', () => {
    expect(measured('250g', false)).toEqual({ value: '250g', asWritten: false });
    expect(measured('2ea (10cm)', false)).toEqual({ value: '2ea (10cm)', asWritten: false });
    expect(measured('', false)).toEqual({ value: '', asWritten: false });
  });

  it('halves a jar figure on Half by the same rules as a glass figure', () => {
    expect(measured('250g', true)).toEqual({ value: '125g', asWritten: false });
    expect(measured('15g', true)).toEqual({ value: '7.5g', asWritten: false });
    expect(measured('1 bottle', true)).toEqual({ value: '0.5 bottle', asWritten: false });
    expect(measured('83g', true)).toEqual(halve('83g'));
  });

  it('marks a jar figure that cannot be split on Half', () => {
    expect(measured('2ea (10cm)', true)).toEqual({ value: '2ea (10cm)', asWritten: true });
    expect(measured('1ea (1/4 cut)', true)).toEqual({ value: '1ea (1/4 cut)', asWritten: true });
  });
});
