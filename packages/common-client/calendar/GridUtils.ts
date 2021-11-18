import { Vector, VectorWithWidthRatio } from './Grid';

export const getNegativeOffset = (vector: Vector) => {
  return vector.y < vector.magnitude ? vector.magnitude - vector.y : 0;
};

export const cutOffNegativeVector = (vector: Vector): Vector => {
  const negativeOffset = getNegativeOffset(vector);

  return {
    id: vector.id,
    y: vector.y,
    x: vector.x,
    magnitude: vector.magnitude - negativeOffset,
  };
};

export const cutOffNegativeVectors = (vectors: Vector[]): Vector[] => {
  return vectors.map(cutOffNegativeVector);
};

export const areVectorsOverlapping = (
  vectorLeft: Vector,
  vectorRight: Vector,
): boolean => {
  return vectorLeft.y < vectorRight.y
    ? vectorRight.y - vectorRight.magnitude < vectorLeft.y
    : vectorLeft.y - vectorLeft.magnitude < vectorRight.y;
};

export const makeVectorsWithWidthRatio = (
  vectors: Vector[],
): VectorWithWidthRatio[] => {
  return vectors
    .sort((a, b) => b.y - a.y)
    .map(vectorLeft => {
      let overlapCount = 0;
      let hasOverlappedOneSelf = false;
      let offsetWidth = 0;

      vectors.forEach(vectorRight => {
        if (areVectorsOverlapping(vectorLeft, vectorRight)) {
          overlapCount++;

          if (vectorRight.id === vectorLeft.id) hasOverlappedOneSelf = true;
          if (!hasOverlappedOneSelf) offsetWidth++;
        }
      });

      return {
        ...vectorLeft,
        widthRatio: 1 / overlapCount,
        offsetWidth,
      };
    });
};

export interface Position {
  height: number;
  width: string;
  top: number;
  left: string;
}

export const makePosition = (
  vector: VectorWithWidthRatio,
  pixelsPerY: number,
  maxY: number,
): Position => {
  return {
    top: pixelsPerY * (maxY - vector.y),
    left: `${vector.offsetWidth * vector.widthRatio * 100}%`,
    width: `${vector.widthRatio * 100}%`,
    height: pixelsPerY * vector.magnitude,
  };
};
