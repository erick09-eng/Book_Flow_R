import { describe, it } from 'node:test';
import assert from 'node:assert';
import { validateReview, MIN_COMMENT, MAX_COMMENT } from '../src/service/reviewService.js';

describe('validateReview', () => {
  describe('rating', () => {
    it('debe fallar si rating es undefined', () => {
      const errors = validateReview({ rating: undefined, comment: 'a'.repeat(MIN_COMMENT) });
      assert.ok(errors.rating);
      assert.strictEqual(errors.rating, 'Elige una calificación de 1 a 5.');
    });

    it('debe fallar si rating es null', () => {
      const errors = validateReview({ rating: null, comment: 'a'.repeat(MIN_COMMENT) });
      assert.ok(errors.rating);
    });

    it('debe fallar si rating es 0', () => {
      const errors = validateReview({ rating: 0, comment: 'a'.repeat(MIN_COMMENT) });
      assert.ok(errors.rating);
    });

    it('debe fallar si rating es 6', () => {
      const errors = validateReview({ rating: 6, comment: 'a'.repeat(MIN_COMMENT) });
      assert.ok(errors.rating);
    });

    it('debe fallar si rating no es entero (3.5)', () => {
      const errors = validateReview({ rating: 3.5, comment: 'a'.repeat(MIN_COMMENT) });
      assert.ok(errors.rating);
    });

    it('debe pasar con rating 1', () => {
      const errors = validateReview({ rating: 1, comment: 'a'.repeat(MIN_COMMENT) });
      assert.strictEqual(errors.rating, undefined);
    });

    it('debe pasar con rating 5', () => {
      const errors = validateReview({ rating: 5, comment: 'a'.repeat(MIN_COMMENT) });
      assert.strictEqual(errors.rating, undefined);
    });

    it('debe pasar con rating como string "3"', () => {
      const errors = validateReview({ rating: '3', comment: 'a'.repeat(MIN_COMMENT) });
      assert.strictEqual(errors.rating, undefined);
    });
  });

  describe('comment', () => {
    it('debe fallar si comment es undefined', () => {
      const errors = validateReview({ rating: 3, comment: undefined });
      assert.ok(errors.comment);
      assert.strictEqual(errors.comment, 'Escribe un comentario.');
    });

    it('debe fallar si comment es string vacío', () => {
      const errors = validateReview({ rating: 3, comment: '' });
      assert.ok(errors.comment);
      assert.strictEqual(errors.comment, 'Escribe un comentario.');
    });

    it('debe fallar si comment es solo espacios', () => {
      const errors = validateReview({ rating: 3, comment: '   ' });
      assert.ok(errors.comment);
      assert.strictEqual(errors.comment, 'Escribe un comentario.');
    });

    it('debe fallar si comment tiene menos de MIN_COMMENT caracteres', () => {
      const short = 'a'.repeat(MIN_COMMENT - 1);
      const errors = validateReview({ rating: 3, comment: short });
      assert.ok(errors.comment);
      assert.ok(errors.comment.includes(String(MIN_COMMENT)));
      assert.ok(errors.comment.includes(String(MIN_COMMENT - 1)));
    });

    it('debe fallar si comment tiene más de MAX_COMMENT caracteres', () => {
      const long = 'a'.repeat(MAX_COMMENT + 1);
      const errors = validateReview({ rating: 3, comment: long });
      assert.ok(errors.comment);
      assert.ok(errors.comment.includes(String(MAX_COMMENT)));
    });

    it('debe pasar con comment de exactamente MIN_COMMENT caracteres', () => {
      const exact = 'a'.repeat(MIN_COMMENT);
      const errors = validateReview({ rating: 3, comment: exact });
      assert.strictEqual(errors.comment, undefined);
    });

    it('debe pasar con comment de exactamente MAX_COMMENT caracteres', () => {
      const exact = 'a'.repeat(MAX_COMMENT);
      const errors = validateReview({ rating: 3, comment: exact });
      assert.strictEqual(errors.comment, undefined);
    });

    it('debe ignorar espacios al inicio y final al contar', () => {
      const padded = '  ' + 'a'.repeat(MIN_COMMENT) + '  ';
      const errors = validateReview({ rating: 3, comment: padded });
      assert.strictEqual(errors.comment, undefined);
    });
  });

  describe('validación completa', () => {
    it('debe pasar con datos válidos', () => {
      const errors = validateReview({ rating: 4, comment: 'Este libro es excelente y muy recomendado.' });
      assert.strictEqual(Object.keys(errors).length, 0);
    });

    it('debe devolver ambos errores si ambos campos son inválidos', () => {
      const errors = validateReview({ rating: 0, comment: '' });
      assert.ok(errors.rating);
      assert.ok(errors.comment);
    });
  });
});