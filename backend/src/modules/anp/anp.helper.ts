import { RANDOM_INDEX } from './anp.constant';

export const normalizeMatrix = (matrix: number[][]) => {
  const size = matrix.length;

  const columnTotals = Array(size).fill(0);

  for (let col = 0; col < size; col++) {
    for (let row = 0; row < size; row++) {
      columnTotals[col] += matrix[row][col];
    }
  }

  return matrix.map((row) =>
    row.map((value, colIndex) => value / columnTotals[colIndex]),
  );
};

export const calculateEigenVector = (normalizedMatrix: number[][]) => {
  return normalizedMatrix.map((row) => {
    const total = row.reduce((acc, value) => acc + value, 0);

    return total / row.length;
  });
};

export const calculateConsistencyRatio = (
  matrix: number[][],
  eigenVector: number[],
) => {
  const size = matrix.length;

  const weightedSumVector = matrix.map((row) =>
    row.reduce((acc, value, index) => acc + value * eigenVector[index], 0),
  );

  const lambdaVector = weightedSumVector.map(
    (value, index) => value / eigenVector[index],
  );

  const lambdaMax = lambdaVector.reduce((acc, value) => acc + value, 0) / size;

  const consistencyIndex = (lambdaMax - size) / (size - 1);

  const randomIndex = RANDOM_INDEX[size];

  const consistencyRatio =
    randomIndex === 0 ? 0 : consistencyIndex / randomIndex;

  return {
    consistencyIndex,
    consistencyRatio,
    isConsistent: consistencyRatio <= 0.1,
  };
};

export const normalizeBenefit = (value: number, max: number) => {
  return value / max;
};

export const normalizeCost = (value: number, min: number) => {
  return min / value;
};
