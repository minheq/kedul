import { Vector } from './Grid';
import {
  areVectorsOverlapping,
  cutOffNegativeVector,
  makeVectorsWithWidthRatio,
} from './GridUtils';

describe('cutOffNegativeVector', () => {
  test.each([
    [{ y: 100, magnitude: 120 }, 100],
    [{ y: 200, magnitude: 320 }, 200],
    [{ y: 200, magnitude: 80 }, 80],
    [{ y: 156, magnitude: 147 }, 147],
  ])('given the vector is %s, it should return %s', (v, expected) => {
    const vector = v as Vector;

    expect(cutOffNegativeVector(vector).magnitude).toBe(expected);
  });
});

describe('areVectorOverlapping', () => {
  test.each([
    [{ y: 100, magnitude: 50 }, { y: 75, magnitude: 50 }, true],
    [{ y: 75, magnitude: 50 }, { y: 100, magnitude: 50 }, true],
    [{ y: 100, magnitude: 75 }, { y: 75, magnitude: 25 }, true],
    [{ y: 75, magnitude: 25 }, { y: 100, magnitude: 75 }, true],
    [{ y: 100, magnitude: 50 }, { y: 50, magnitude: 50 }, false],
    [{ y: 100, magnitude: 50 }, { y: 49, magnitude: 25 }, false],
    [{ y: 100, magnitude: 50 }, { y: 25, magnitude: 25 }, false],
  ])(
    'given the vectorLeft is %s and vectorRight is %s, it should return %s',
    (vLeft, vRight, expected) => {
      const vectorLeft = vLeft as Vector;
      const vectorRight = vRight as Vector;

      expect(areVectorsOverlapping(vectorLeft, vectorRight)).toBe(expected);
      expect(areVectorsOverlapping(vectorRight, vectorLeft)).toBe(expected);
    },
  );
});

describe('makeVectorsWithWidthRatio', () => {
  test.each([
    [
      [{ y: 100, magnitude: 50, id: '1' }, { y: 75, magnitude: 25, id: '2' }],
      1 / 2,
    ],
    [
      [
        { y: 100, magnitude: 60, id: '1' },
        { y: 75, magnitude: 30, id: '2' },
        { y: 50, magnitude: 50, id: '3' },
      ],
      1 / 3,
    ],
    [
      [
        { y: 100, magnitude: 100, id: '1' },
        { y: 75, magnitude: 30, id: '2' },
        { y: 50, magnitude: 50, id: '3' },
      ],
      1 / 3,
    ],
    [
      [
        { y: 100, magnitude: 50, id: '1' },
        { y: 75, magnitude: 50, id: '2' },
        { y: 60, magnitude: 50, id: '3' },
      ],
      1 / 3,
    ],
    [
      [{ y: 100, magnitude: 50, id: '1' }, { y: 25, magnitude: 25, id: '2' }],
      1,
    ],
  ])(
    'given the vectorList %s, all should return with ratio %s',
    (v, expectedRatio) => {
      const vectors = makeVectorsWithWidthRatio(v as Vector[]);
      expect(vectors.every(v => v.widthRatio === expectedRatio)).toBeTruthy();

      expect(
        vectors.every((v, index) => {
          if (expectedRatio === 1) return v.offsetWidth === 0;

          return v.offsetWidth === index;
        }),
      ).toBeTruthy();
    },
  );
});
