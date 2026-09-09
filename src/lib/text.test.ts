import { describe, expect, it } from 'vitest';
import { capitalise, titleCase } from './text';

describe('titleCase', () => {
  it('capitalises every word of a drink name', () => {
    expect(titleCase('jim beam & coke')).toBe('Jim Beam & Coke');
  });

  it('leaves the small words small after the first', () => {
    expect(titleCase('gin and tonic')).toBe('Gin and Tonic');
    expect(titleCase('queen of hearts')).toBe('Queen of Hearts');
    expect(titleCase('rum with lime')).toBe('Rum with Lime');
    expect(titleCase('salt or sugar')).toBe('Salt or Sugar');
  });

  it('capitalises a small word when it comes first', () => {
    expect(titleCase('of mice and men')).toBe('Of Mice and Men');
  });

  it('leaves a word alone when it already carries a capital inside it', () => {
    expect(titleCase('iPhone')).toBe('iPhone');
    expect(titleCase('iPhone case')).toBe('iPhone Case');
    expect(titleCase('MAKGEOLLI spritz')).toBe('MAKGEOLLI Spritz');
  });

  it('keeps a shouted word as it was written', () => {
    expect(titleCase('SODA')).toBe('SODA');
    expect(titleCase('sODA')).toBe('sODA');
    expect(titleCase('soda water')).toBe('Soda Water');
  });

  it('keeps the spacing it was given', () => {
    expect(titleCase('  soda  water ')).toBe('  Soda  Water ');
  });

  it('leaves an empty name empty', () => {
    expect(titleCase('')).toBe('');
    expect(titleCase('   ')).toBe('   ');
  });

  it('is pure and does not touch its input', () => {
    const input = 'soda water';
    titleCase(input);
    expect(input).toBe('soda water');
  });
});

describe('capitalise', () => {
  it('lifts the first letter of an ingredient and leaves the rest alone', () => {
    expect(capitalise('peach mak.g mix')).toBe('Peach mak.g mix');
    expect(capitalise('soda water')).toBe('Soda water');
    expect(capitalise('lime juice')).toBe('Lime juice');
  });

  it('leaves a first word alone when it already carries a capital inside it', () => {
    expect(capitalise('iPhone')).toBe('iPhone');
    expect(capitalise('iPhone charger')).toBe('iPhone charger');
  });

  it('keeps the spacing it was given', () => {
    expect(capitalise('  lime juice')).toBe('  Lime juice');
  });

  it('leaves an empty ingredient empty', () => {
    expect(capitalise('')).toBe('');
    expect(capitalise('   ')).toBe('   ');
  });

  it('leaves a figure alone', () => {
    expect(capitalise('2 limes')).toBe('2 limes');
  });
});
