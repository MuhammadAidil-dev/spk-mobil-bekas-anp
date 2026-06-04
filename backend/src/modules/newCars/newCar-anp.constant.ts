import { DependencyMatrices } from '../anp/anp.constant';

// ============================================================
// CRITERIA INDEX MAP
//
// Urutan ini WAJIB konsisten di seluruh modul new-car ANP.
// Index: 0=PRICE, 1=ENGINE, 2=SEAT, 3=FUEL
// ============================================================
export const NEW_CAR_CRITERIA_INDEX: Record<string, number> = {
  PRICE: 0,
  ENGINE: 1,
  SEAT: 2,
  FUEL: 3,
};

export const NEW_CAR_CRITERIA_COUNT = 4;

// ============================================================
// FIXED CRITERIA DEFINITION
//
// Tidak dapat diubah dari UI — alasan akademik.
// ============================================================
export const NEW_CAR_CRITERIA = [
  { code: 'PRICE', name: 'Harga', type: 'cost' as const },
  { code: 'ENGINE', name: 'Kapasitas Mesin', type: 'benefit' as const },
  { code: 'SEAT', name: 'Kapasitas Kursi', type: 'benefit' as const },
  { code: 'FUEL', name: 'Efisiensi BBM', type: 'benefit' as const },
];

// ============================================================
// FIXED PAIRWISE COMPARISON MATRIX
//
// Urutan baris/kolom: [PRICE, ENGINE, SEAT, FUEL]
//
// Justifikasi (berdasarkan perilaku pembelian mobil baru):
//   - PRICE lebih penting dari ENGINE (3x)
//   - PRICE lebih penting dari SEAT (5x)
//   - PRICE lebih penting dari FUEL (3x)
//   - ENGINE lebih penting dari SEAT (3x)
//   - FUEL setara ENGINE (1x) — keduanya pertimbangan teknis utama
// ============================================================
export const NEW_CAR_PAIRWISE_MATRIX: number[][] = [
  //  PRICE   ENGINE   SEAT     FUEL
  [1, 3, 5, 3], // PRICE
  [1 / 3, 1, 3, 1], // ENGINE
  [1 / 5, 1 / 3, 1, 1 / 3], // SEAT
  [1 / 3, 1, 3, 1], // FUEL
];

// ============================================================
// FIXED DEPENDENCY MATRICES
//
// Dependency yang dimodelkan:
//   ENGINE → PRICE  : mesin besar → harga lebih tinggi
//   ENGINE → FUEL   : mesin besar → efisiensi BBM lebih rendah
//   FUEL   → PRICE  : efisiensi tinggi → harga premium
//   SEAT   → PRICE  : kapasitas besar → harga lebih tinggi
//
// Visual:
//   ENGINE ──► PRICE
//   ENGINE ──► FUEL ──► PRICE
//   SEAT   ──► PRICE
//
// Format: dependencyMatrices[colIndex] = pairwise matrix
// dari kriteria yang MEMPENGARUHI kolom tersebut.
// ============================================================
export const NEW_CAR_DEPENDENCY_MATRICES: DependencyMatrices = {
  // Kolom 0 (PRICE) dipengaruhi ENGINE (idx 1), SEAT (idx 2), FUEL (idx 3)
  // Pairwise: seberapa besar pengaruh ENGINE vs SEAT vs FUEL terhadap PRICE
  0: [
    //  ENGINE   SEAT    FUEL
    [1, 3, 1], // ENGINE
    [1 / 3, 1, 1 / 3], // SEAT
    [1, 3, 1], // FUEL
  ],

  // Kolom 3 (FUEL) dipengaruhi ENGINE (idx 1)
  // Hanya 1 kriteria yang mempengaruhi → matrix 1×1
  3: [
    [1], // ENGINE
  ],
};

// ============================================================
// DEPENDENCY INFLUENCERS
//
// Key   = index kolom (kriteria yang dipengaruhi)
// Value = array index baris (kriteria yang mempengaruhi)
// ============================================================
export const NEW_CAR_DEPENDENCY_INFLUENCERS: Record<number, number[]> = {
  0: [1, 2, 3], // PRICE dipengaruhi ENGINE, SEAT, FUEL
  3: [1], // FUEL dipengaruhi ENGINE
};
