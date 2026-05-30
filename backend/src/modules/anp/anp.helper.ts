import {
  RANDOM_INDEX,
  CRITERIA_COUNT,
  DependencyMatrices,
  DEPENDENCY_INFLUENCERS,
} from './anp.constant';

// ============================================================
// TIPE DATA
// ============================================================
export type Matrix = number[][];

export interface ConsistencyResult {
  lambdaMax: number;
  consistencyIndex: number;
  consistencyRatio: number;
  isConsistent: boolean;
}

// ============================================================
// STEP 1 — NORMALISASI MATRIX PAIRWISE
//
// Setiap elemen dibagi dengan jumlah kolomnya.
// Hasil: normalized matrix (setiap kolom berjumlah 1).
// ============================================================
export const normalizeMatrix = (matrix: Matrix): Matrix => {
  const size = matrix.length;

  const columnTotals = Array(size).fill(0) as number[];

  for (let col = 0; col < size; col++) {
    for (let row = 0; row < size; row++) {
      columnTotals[col] += matrix[row][col];
    }
  }

  return matrix.map((row) =>
    row.map((value, colIndex) => value / columnTotals[colIndex]),
  );
};

// ============================================================
// STEP 2 — HITUNG EIGENVECTOR (Priority Vector)
//
// Rata-rata setiap baris dari normalized matrix.
// Hasil: array bobot prioritas tiap kriteria (sum = 1).
// ============================================================
export const calculateEigenVector = (normalizedMatrix: Matrix): number[] => {
  return normalizedMatrix.map((row) => {
    const total = row.reduce((acc, value) => acc + value, 0);
    return total / row.length;
  });
};

// ============================================================
// STEP 3 — HITUNG CONSISTENCY RATIO
//
// CR = CI / RI
// CI = (λmax - n) / (n - 1)
// λmax = rata-rata dari (weighted sum vector / eigenvector)
//
// Syarat konsisten: CR ≤ 0.1
// ============================================================
export const calculateConsistencyRatio = (
  matrix: Matrix,
  eigenVector: number[],
): ConsistencyResult => {
  const size = matrix.length;

  // Weighted sum vector: A × w
  const weightedSumVector = matrix.map((row) =>
    row.reduce((acc, value, index) => acc + value * eigenVector[index], 0),
  );

  // λ vector: (A × w)i / wi
  const lambdaVector = weightedSumVector.map((value, index) => {
    if (eigenVector[index] === 0) return 0;
    return value / eigenVector[index];
  });

  // λmax
  const lambdaMax = lambdaVector.reduce((acc, value) => acc + value, 0) / size;

  // CI
  const consistencyIndex = size <= 1 ? 0 : (lambdaMax - size) / (size - 1);

  // RI
  const randomIndex = RANDOM_INDEX[size] ?? 1.49;

  // CR
  const consistencyRatio =
    randomIndex === 0 ? 0 : consistencyIndex / randomIndex;

  return {
    lambdaMax,
    consistencyIndex,
    consistencyRatio,
    isConsistent: consistencyRatio <= 0.1,
  };
};

// ============================================================
// STEP 4 — BANGUN UNWEIGHTED SUPERMATRIX
//
// Supermatrix berukuran n×n (n = jumlah kriteria).
// Tiap KOLOM diisi dengan eigenvector lokal:
//
//   - Jika kolom j punya dependency → kolom j diisi eigenvector
//     dari pairwise matrix dependency-nya (hanya pada baris
//     yang merupakan influencer-nya, baris lain = 0).
//
//   - Jika kolom j TIDAK punya dependency → kolom j diisi
//     eigenvector global dari pairwise matrix utama.
//
// Ini adalah inti perbedaan ANP vs AHP.
// ============================================================
export const buildUnweightedSupermatrix = (
  globalEigenVector: number[],
  dependencyMatrices: DependencyMatrices,
): Matrix => {
  const n = CRITERIA_COUNT;

  // Inisialisasi supermatrix n×n dengan nol
  const supermatrix: Matrix = Array.from({ length: n }, () => Array(n).fill(0));

  for (let col = 0; col < n; col++) {
    const influencers = DEPENDENCY_INFLUENCERS[col];

    if (influencers && dependencyMatrices[col]) {
      // Kolom ini punya dependency → hitung eigenvector lokal
      const depMatrix = dependencyMatrices[col];
      const normalizedDep = normalizeMatrix(depMatrix);
      const localEigenVector = calculateEigenVector(normalizedDep);

      // Isi baris yang merupakan influencer dengan bobot lokal
      influencers.forEach((rowIndex, i) => {
        supermatrix[rowIndex][col] = localEigenVector[i] ?? 0;
      });

      // Baris lain (non-influencer) tetap 0
    } else {
      // Kolom ini tidak punya dependency → gunakan eigenvector global
      for (let row = 0; row < n; row++) {
        supermatrix[row][col] = globalEigenVector[row];
      }
    }
  }

  return supermatrix;
};

// ============================================================
// STEP 5 — BANGUN WEIGHTED SUPERMATRIX
//
// Setiap kolom unweighted supermatrix dinormalisasi agar
// total tiap kolom = 1 (column stochastic matrix).
//
// Formula per elemen:
//   W[row][col] = U[row][col] * w[col] / Σ(U[i][col] * w[col])
//               = U[row][col] / Σ(U[i][col])  ← karena w[col] dibatalkan
//
// Dalam praktiknya: normalisasi ulang setiap kolom supermatrix.
// ============================================================
export const buildWeightedSupermatrix = (
  unweightedSupermatrix: Matrix,
  globalEigenVector: number[],
): Matrix => {
  const n = CRITERIA_COUNT;
  const weighted: Matrix = Array.from({ length: n }, () => Array(n).fill(0));

  for (let col = 0; col < n; col++) {
    // Hitung total kolom (hanya dari baris yang non-zero)
    const colSum = unweightedSupermatrix.reduce(
      (acc, row) => acc + row[col],
      0,
    );

    for (let row = 0; row < n; row++) {
      weighted[row][col] =
        colSum === 0 ? 0 : unweightedSupermatrix[row][col] / colSum;
    }
  }

  return weighted;
};

// ============================================================
// STEP 6 — BANGUN LIMIT SUPERMATRIX
//
// Pangkatkan weighted supermatrix berulang kali hingga
// nilai tiap baris di semua kolom konvergen (sama).
//
// Limit matrix merepresentasikan bobot prioritas jangka panjang
// yang mempertimbangkan seluruh hubungan dependency dalam network.
// ============================================================
export const buildLimitSupermatrix = (
  weightedSupermatrix: Matrix,
  maxIterations = 1024,
  tolerance = 1e-10,
): Matrix => {
  let current = weightedSupermatrix.map((row) => [...row]);

  for (let iter = 0; iter < maxIterations; iter++) {
    const next = multiplyMatrix(current, current);

    // Cek konvergensi: max perbedaan antar iterasi
    let maxDiff = 0;
    for (let i = 0; i < current.length; i++) {
      for (let j = 0; j < current[i].length; j++) {
        maxDiff = Math.max(maxDiff, Math.abs(next[i][j] - current[i][j]));
      }
    }

    current = next;

    if (maxDiff < tolerance) break;
  }

  return current;
};

// ============================================================
// STEP 7 — EKSTRAK FINAL WEIGHTS DARI LIMIT MATRIX
//
// Ambil rata-rata setiap baris dari limit matrix.
// Hasil: bobot final tiap kriteria yang sudah mempertimbangkan
// seluruh dependency dalam network.
// ============================================================
export const extractFinalWeights = (limitMatrix: Matrix): number[] => {
  return limitMatrix.map((row) => {
    const sum = row.reduce((acc, val) => acc + val, 0);
    return sum / row.length;
  });
};

// ============================================================
// STEP 8 — NORMALISASI NILAI ALTERNATIF (Scoring)
//
// Benefit (engine, seat): semakin besar semakin baik → value/max
// Cost (price, mileage) : semakin kecil semakin baik → min/value
// ============================================================
export const normalizeBenefit = (value: number, max: number): number => {
  if (max === 0) return 0;
  return value / max;
};

export const normalizeCost = (value: number, min: number): number => {
  if (value === 0) return 0;
  return min / value;
};

// ============================================================
// UTILITAS — PERKALIAN MATRIX (A × B)
// ============================================================
export const multiplyMatrix = (a: Matrix, b: Matrix): Matrix => {
  const n = a.length;
  return Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) =>
      a[i].reduce((sum, _, k) => sum + a[i][k] * b[k][j], 0),
    ),
  );
};

// ============================================================
// UTILITAS — ROUND DESIMAL (untuk logging/display)
// ============================================================
export const roundDecimal = (value: number, places = 6): number => {
  const factor = Math.pow(10, places);
  return Math.round(value * factor) / factor;
};
