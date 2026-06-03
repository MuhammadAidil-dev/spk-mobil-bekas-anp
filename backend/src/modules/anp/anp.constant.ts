// ============================================================
// CRITERIA INDEX MAP
// Urutan ini WAJIB konsisten di seluruh modul ANP
// Index: 0=PRICE, 1=MILEAGE, 2=ENGINE_CAPACITY, 3=SEAT_CAPACITY
// ============================================================
export const CRITERIA_INDEX: Record<string, number> = {
  PRICE: 0,
  MILEAGE: 1,
  ENGINE_CAPACITY: 2,
  SEAT_CAPACITY: 3,
};

export const CRITERIA_COUNT = 4;

// ============================================================
// SAATY RANDOM INDEX TABLE
// Digunakan untuk menghitung Consistency Ratio (CR)
// Ref: Saaty, T.L. (1980). The Analytic Hierarchy Process.
// ============================================================
export const RANDOM_INDEX: Record<number, number> = {
  1: 0,
  2: 0,
  3: 0.58,
  4: 0.9,
  5: 1.12,
  6: 1.24,
  7: 1.32,
  8: 1.41,
  9: 1.45,
  10: 1.49,
};

// ============================================================
// DEFAULT PAIRWISE COMPARISON MATRIX (Kriteria vs Kriteria)
//
// Urutan baris/kolom: [PRICE, MILEAGE, ENGINE_CAPACITY, SEAT_CAPACITY]
//
// Interpretasi nilai Saaty:
//   1   = sama penting
//   3   = sedikit lebih penting
//   5   = lebih penting
//   7   = sangat lebih penting
//   9   = mutlak lebih penting
//   1/n = kebalikan
//
// Justifikasi matrix ini:
//   - ENGINE_CAPACITY paling penting (performa kendaraan)
//   - SEAT_CAPACITY penting kedua (kebutuhan kapasitas)
//   - PRICE penting ketiga (pertimbangan ekonomi)
//   - MILEAGE paling rendah prioritasnya (relatif terhadap harga)
// ============================================================
export const DEFAULT_PAIRWISE_MATRIX: number[][] = [
  //  PRICE     MILEAGE   ENGINE    SEAT
  [1, 3, 1 / 5, 1 / 3], // PRICE
  [1 / 3, 1, 1 / 7, 1 / 5], // MILEAGE
  [5, 7, 1, 3], // ENGINE_CAPACITY
  [3, 5, 1 / 3, 1], // SEAT_CAPACITY
];

// ============================================================
// DEFAULT DEPENDENCY RELATION MATRIX
//
// Merepresentasikan hubungan ketergantungan antar kriteria.
// Ini adalah pembeda utama ANP vs AHP.
//
// Struktur: dependencyMatrices[col][row] menunjukkan
// "seberapa besar pengaruh kriteria [row] terhadap kriteria [col]"
// dalam bentuk pairwise comparison matrix.
//
// Justifikasi dependency yang dimodelkan:
//
// [PRICE dipengaruhi MILEAGE & ENGINE_CAPACITY]
//   - Mobil bermileage tinggi cenderung berharga lebih rendah
//   - Kapasitas mesin besar berkorelasi dengan harga lebih tinggi
//
// [MILEAGE dipengaruhi PRICE]
//   - Harga yang lebih tinggi sering mencerminkan mileage rendah
//
// Kriteria yang tidak memiliki dependency (ENGINE_CAPACITY, SEAT_CAPACITY)
// tidak dimasukkan ke dependencyMatrices → kolom supermatrix-nya diisi
// eigenvector dari pairwise matrix utama.
//
// Format key: "colIndex" (kolom supermatrix yang terpengaruh)
// Isi: pairwise matrix dari kriteria yang MEMPENGARUHI kolom tersebut
// ============================================================
export type DependencyMatrices = Record<number, number[][]>;

export const DEFAULT_DEPENDENCY_MATRICES: DependencyMatrices = {
  // Kolom 0 (PRICE) dipengaruhi oleh MILEAGE (idx 1) dan ENGINE_CAPACITY (idx 2)
  // Pairwise: seberapa besar pengaruh MILEAGE vs ENGINE_CAPACITY terhadap PRICE
  0: [
    // Baris/kolom hanya untuk kriteria yang mempengaruhi: [MILEAGE, ENGINE_CAPACITY]
    //  MILEAGE   ENGINE
    [1, 1 / 3], // MILEAGE
    [3, 1], // ENGINE_CAPACITY
  ],

  // Kolom 1 (MILEAGE) dipengaruhi oleh PRICE (idx 0)
  // Hanya 1 kriteria yang mempengaruhi → matrix 1x1 bernilai [1]
  1: [
    [1], // PRICE
  ],
};

// Mendefinisikan kriteria mana saja yang mempengaruhi tiap kolom.
// Key = index kolom, Value = array index baris yang mempengaruhi kolom tersebut.
export const DEPENDENCY_INFLUENCERS: Record<number, number[]> = {
  0: [1, 2], // PRICE dipengaruhi oleh MILEAGE dan ENGINE_CAPACITY
  1: [0], // MILEAGE dipengaruhi oleh PRICE
};
