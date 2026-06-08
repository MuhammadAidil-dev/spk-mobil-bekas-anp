# Dokumentasi Proses Perhitungan ANP (Analytic Network Process)
## Sistem Pendukung Keputusan Pemilihan Mobil

---

## Daftar Isi

1. [Pendahuluan](#1-pendahuluan)
2. [Perbedaan ANP dan AHP](#2-perbedaan-anp-dan-ahp)
3. [Kriteria dan Bobot](#3-kriteria-dan-bobot)
4. [Skala Perbandingan Saaty](#4-skala-perbandingan-saaty)
5. [Matriks Perbandingan Berpasangan](#5-matriks-perbandingan-berpasangan)
6. [Alur Perhitungan ANP](#6-alur-perhitungan-anp)
   - [Step 1: Normalisasi Matriks Pairwise](#step-1-normalisasi-matriks-pairwise)
   - [Step 2: Hitung Eigenvector Global](#step-2-hitung-eigenvector-global)
   - [Step 3: Uji Konsistensi (CR)](#step-3-uji-konsistensi-cr)
   - [Step 4: Bangun Unweighted Supermatrix](#step-4-bangun-unweighted-supermatrix)
   - [Step 5: Bangun Weighted Supermatrix](#step-5-bangun-weighted-supermatrix)
   - [Step 6: Bangun Limit Supermatrix](#step-6-bangun-limit-supermatrix)
   - [Step 7: Ekstrak Final Weights](#step-7-ekstrak-final-weights)
   - [Step 8: Normalisasi Nilai Alternatif](#step-8-normalisasi-nilai-alternatif)
   - [Step 9: Hitung Final Score](#step-9-hitung-final-score)
   - [Step 10: Ranking Alternatif](#step-10-ranking-alternatif)
7. [Contoh Perhitungan — Mobil Bekas](#7-contoh-perhitungan--mobil-bekas)
8. [Modul Mobil Baru (New Cars)](#8-modul-mobil-baru-new-cars)
9. [Dependency Relations](#9-dependency-relations)
10. [Penjelasan Output API](#10-penjelasan-output-api)
11. [Referensi](#11-referensi)

---

## 1. Pendahuluan

ANP (Analytic Network Process) adalah metode pengambilan keputusan multi-kriteria yang dikembangkan oleh **Thomas L. Saaty** (1996). ANP merupakan generalisasi dari AHP (Analytic Hierarchy Process) yang mampu memodelkan **hubungan ketergantungan (dependency) dan umpan balik (feedback) antar kriteria**.

Pada proyek ini, ANP digunakan untuk **meranking dan merekomendasikan mobil** (baik mobil bekas maupun mobil baru) berdasarkan beberapa kriteria yang saling berkaitan.

### Tujuan Sistem

- Membantu pengambil keputusan dalam memilih mobil terbaik
- Mempertimbangkan hubungan antar kriteria secara realistis
- Menghasilkan peringkat yang objektif dan terukur

### Modul yang Menggunakan ANP

| Modul | Endpoint | Kriteria |
|-------|----------|----------|
| Mobil Bekas | `GET /api/v1/anp/calculate` | Harga, Mileage, Kapasitas Mesin, Kapasitas Kursi |
| Mobil Baru | `GET /api/v1/new-cars/calculate-new-cars` | Harga, Kapasitas Mesin, Kapasitas Kursi, Efisiensi BBM |

---

## 2. Perbedaan ANP dan AHP

| Aspek | AHP | ANP |
|-------|-----|-----|
| Struktur | Hierarki linear (top-down) | Jaringan (network) dengan dependency |
| Hubungan antar kriteria | Tidak diperhitungkan | Dimodelkan secara eksplisit |
| Supermatrix | Tidak ada | Ada (Unweighted → Weighted → Limit) |
| Akurasi | Lebih sederhana | Lebih akurat untuk masalah kompleks |
| Kompleksitas | Rendah | Lebih tinggi |

**Kunci perbedaan utama di kode ini:** pada ANP, kolom supermatrix untuk kriteria yang memiliki dependency diisi dengan **eigenvector lokal dari matriks dependency**, bukan eigenvector global. Kriteria tanpa dependency tetap menggunakan eigenvector global.

---

## 3. Kriteria dan Bobot

### 3.1 Mobil Bekas

| Index | Kode | Nama | Tipe | Keterangan |
|-------|------|------|------|------------|
| 0 | `PRICE` | Harga | **Cost** | Semakin murah semakin baik |
| 1 | `MILEAGE` | Jarak Tempuh | **Cost** | Semakin rendah semakin baik |
| 2 | `ENGINE_CAPACITY` | Kapasitas Mesin | **Benefit** | Semakin besar semakin baik |
| 3 | `SEAT_CAPACITY` | Kapasitas Kursi | **Benefit** | Semakin banyak semakin baik |

### 3.2 Mobil Baru

| Index | Kode | Nama | Tipe | Keterangan |
|-------|------|------|------|------------|
| 0 | `PRICE` | Harga | **Cost** | Semakin murah semakin baik |
| 1 | `ENGINE` | Kapasitas Mesin | **Benefit** | Semakin besar semakin baik |
| 2 | `SEAT` | Kapasitas Kursi | **Benefit** | Semakin banyak semakin baik |
| 3 | `FUEL` | Efisiensi BBM | **Benefit** | Semakin hemat semakin baik |

---

## 4. Skala Perbandingan Saaty

Nilai perbandingan berpasangan menggunakan **Skala Saaty 1–9**:

| Nilai | Keterangan |
|-------|------------|
| 1 | Sama penting |
| 3 | Sedikit lebih penting |
| 5 | Lebih penting |
| 7 | Sangat lebih penting |
| 9 | Mutlak lebih penting |
| 2, 4, 6, 8 | Nilai tengah (kompromi) |
| 1/n | Nilai kebalikan |

---

## 5. Matriks Perbandingan Berpasangan

### 5.1 Mobil Bekas — Default Pairwise Matrix

Urutan kolom/baris: `[PRICE, MILEAGE, ENGINE_CAPACITY, SEAT_CAPACITY]`

|  | PRICE | MILEAGE | ENGINE | SEAT |
|--|-------|---------|--------|------|
| **PRICE** | 1 | 3 | 1/5 | 1/3 |
| **MILEAGE** | 1/3 | 1 | 1/7 | 1/5 |
| **ENGINE** | 5 | 7 | 1 | 3 |
| **SEAT** | 3 | 5 | 1/3 | 1 |

**Justifikasi:**
- `ENGINE_CAPACITY` paling dominan — performa kendaraan adalah pertimbangan utama
- `SEAT_CAPACITY` penting kedua — kapasitas angkut menentukan kegunaan
- `PRICE` ketiga — pertimbangan ekonomi penting namun tidak primer
- `MILEAGE` terendah — relatif terhadap harga, bisa dijadikan indikator sekunder

### 5.2 Mobil Baru — Default Pairwise Matrix

Urutan kolom/baris: `[PRICE, ENGINE, SEAT, FUEL]`

|  | PRICE | ENGINE | SEAT | FUEL |
|--|-------|--------|------|------|
| **PRICE** | 1 | 3 | 5 | 3 |
| **ENGINE** | 1/3 | 1 | 3 | 1 |
| **SEAT** | 1/5 | 1/3 | 1 | 1/3 |
| **FUEL** | 1/3 | 1 | 3 | 1 |

**Justifikasi:**
- `PRICE` paling penting untuk mobil baru — investasi jangka panjang
- `ENGINE` dan `FUEL` setara — keduanya pertimbangan teknis utama
- `SEAT` paling rendah — kapasitas sebagai pertimbangan tersier

---

## 6. Alur Perhitungan ANP

```
Pairwise Matrix
      │
      ▼
┌─────────────────────┐
│ Step 1: Normalisasi │ → Normalized Matrix
└─────────────────────┘
      │
      ▼
┌──────────────────────────┐
│ Step 2: Eigenvector      │ → Global Priority Vector [w1, w2, w3, w4]
└──────────────────────────┘
      │
      ▼
┌─────────────────────────────────┐
│ Step 3: Consistency Ratio (CR)  │ → CR ≤ 0.1 ? Lanjut : Error
└─────────────────────────────────┘
      │
      ▼
┌────────────────────────────────────┐
│ Step 4: Unweighted Supermatrix     │ → Supermatrix n×n
│  (menggunakan dependency relations) │
└────────────────────────────────────┘
      │
      ▼
┌──────────────────────────────────┐
│ Step 5: Weighted Supermatrix     │ → Column Stochastic Matrix
│  (normalisasi kolom)             │
└──────────────────────────────────┘
      │
      ▼
┌──────────────────────────────────┐
│ Step 6: Limit Supermatrix        │ → W^2k konvergen
│  (pangkat matriks hingga stabil) │
└──────────────────────────────────┘
      │
      ▼
┌──────────────────────────────────┐
│ Step 7: Final Weights            │ → [w_final_1, ..., w_final_n]
│  (rata-rata baris limit matrix)  │
└──────────────────────────────────┘
      │
      ▼
┌──────────────────────────────────────────┐
│ Step 8: Normalisasi Nilai Alternatif      │
│  Benefit: value/max   Cost: min/value    │
└──────────────────────────────────────────┘
      │
      ▼
┌──────────────────────────────────┐
│ Step 9: Final Score per Alternatif│
│  score = Σ (norm_value × weight) │
└──────────────────────────────────┘
      │
      ▼
┌──────────────────────┐
│ Step 10: Ranking     │ → Sorted by score DESC
└──────────────────────┘
```

---

### Step 1: Normalisasi Matriks Pairwise

**Tujuan:** Mengubah matriks pairwise mentah menjadi bobot relatif per kolom.

**Formula:**

$$\text{Normalized}[i][j] = \frac{A[i][j]}{\sum_{k=1}^{n} A[k][j]}$$

**Langkah:**
1. Hitung jumlah total tiap **kolom** pada matriks pairwise
2. Bagi setiap elemen dengan total kolomnya

**Contoh (4×4):**

```
Matriks Asli:            Jumlah Kolom:
[1,    3,    0.2,  0.33]   [9.33, 16, 1.68, 4.53]
[0.33, 1,    0.14, 0.2 ]
[5,    7,    1,    3   ]
[3,    5,    0.33, 1   ]

Normalized[0][0] = 1 / 9.33 = 0.107
Normalized[2][0] = 5 / 9.33 = 0.536
```

**Implementasi:** `normalizeMatrix()` di [anp.helper.ts](../src/modules/anp/anp.helper.ts)

---

### Step 2: Hitung Eigenvector Global

**Tujuan:** Menghitung vektor prioritas/bobot tiap kriteria.

**Formula:**

$$w_i = \frac{1}{n} \sum_{j=1}^{n} \text{Normalized}[i][j]$$

**Langkah:**
1. Rata-ratakan setiap **baris** pada normalized matrix
2. Hasilnya adalah **Priority Vector** (eigenvector aproksimasi)

**Properti:**
- Semua nilai positif
- Jumlah semua elemen = 1

**Contoh:**
```
Normalized Matrix:
Baris 0: [0.107, 0.188, 0.119, 0.073] → rata-rata = 0.122 (bobot PRICE)
Baris 2: [0.536, 0.438, 0.595, 0.662] → rata-rata = 0.558 (bobot ENGINE)
```

**Implementasi:** `calculateEigenVector()` di [anp.helper.ts](../src/modules/anp/anp.helper.ts)

---

### Step 3: Uji Konsistensi (CR)

**Tujuan:** Memastikan penilaian perbandingan berpasangan tidak kontradiktif.

#### 3a. Hitung Weighted Sum Vector

$$\text{WS}_i = \sum_{j=1}^{n} A[i][j] \times w_j$$

Yaitu: perkalian matriks asli dengan eigenvector → `A × w`

#### 3b. Hitung λ Vector

$$\lambda_i = \frac{\text{WS}_i}{w_i}$$

#### 3c. Hitung λmax

$$\lambda_{\max} = \frac{1}{n} \sum_{i=1}^{n} \lambda_i$$

#### 3d. Hitung Consistency Index (CI)

$$CI = \frac{\lambda_{\max} - n}{n - 1}$$

#### 3e. Hitung Consistency Ratio (CR)

$$CR = \frac{CI}{RI}$$

Dimana **RI** (Random Index) adalah:

| n | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| RI | 0 | 0 | 0.58 | 0.90 | 1.12 | 1.24 | 1.32 | 1.41 | 1.45 | 1.49 |

#### 3f. Keputusan

```
CR ≤ 0.1  →  KONSISTEN  →  Lanjut ke Step 4
CR > 0.1  →  TIDAK KONSISTEN  →  Throw Error (400 Bad Request)
```

**Implementasi:** `calculateConsistencyRatio()` di [anp.helper.ts](../src/modules/anp/anp.helper.ts)

---

### Step 4: Bangun Unweighted Supermatrix

**Tujuan:** Merepresentasikan seluruh hubungan dalam network ke dalam satu matriks.

Ini adalah **pembeda utama ANP dari AHP**.

**Ukuran supermatrix:** `n × n` (n = jumlah kriteria)

**Aturan pengisian kolom:**

```
Untuk setiap kolom j:

  JIKA kriteria j memiliki dependency (ada dalam DEPENDENCY_INFLUENCERS):
    → Hitung eigenvector LOKAL dari matriks dependency kolom j
    → Isi baris yang merupakan influencer dengan bobot lokal tersebut
    → Baris lain (non-influencer) = 0

  JIKA tidak ada dependency:
    → Isi seluruh kolom j dengan eigenvector GLOBAL (dari Step 2)
```

#### Dependency Matriks (Mobil Bekas)

**Kolom 0 (PRICE) dipengaruhi oleh MILEAGE dan ENGINE_CAPACITY:**

```
Dependency Matrix untuk PRICE:
          MILEAGE  ENGINE
MILEAGE  [  1,     1/3  ]
ENGINE   [  3,      1   ]
```

→ Normalisasi → Eigenvector lokal → Isi baris 1 (MILEAGE) dan baris 2 (ENGINE) pada kolom 0

**Kolom 1 (MILEAGE) dipengaruhi oleh PRICE:**

```
Dependency Matrix untuk MILEAGE:
       PRICE
PRICE [  1  ]
```

→ Eigenvector = [1] → Isi baris 0 (PRICE) pada kolom 1

**Kolom 2 (ENGINE) dan 3 (SEAT) tidak memiliki dependency:**
→ Gunakan eigenvector global di seluruh kolom

**Implementasi:** `buildUnweightedSupermatrix()` di [anp.helper.ts](../src/modules/anp/anp.helper.ts)

---

### Step 5: Bangun Weighted Supermatrix

**Tujuan:** Membuat supermatrix menjadi **column stochastic** (jumlah setiap kolom = 1).

**Formula:**

$$W[i][j] = \frac{U[i][j]}{\sum_{k=1}^{n} U[k][j]}$$

**Langkah:**
1. Hitung total setiap kolom pada unweighted supermatrix
2. Bagi setiap elemen dengan total kolomnya

**Properti hasil:** Setiap kolom berjumlah 1, memungkinkan matrix dipangkatkan berulang kali tanpa nilai meledak.

**Implementasi:** `buildWeightedSupermatrix()` di [anp.helper.ts](../src/modules/anp/anp.helper.ts)

---

### Step 6: Bangun Limit Supermatrix

**Tujuan:** Mendapatkan bobot jangka panjang yang stabil dan konvergen.

**Formula:**

$$L = \lim_{k \to \infty} W^{2^k}$$

**Algoritma (pangkat berulang):**

```
current = weightedSupermatrix

for iter = 1 to maxIterations (1024):
    next = current × current  (perkalian matriks)

    maxDiff = max |next[i][j] - current[i][j]|

    current = next

    if maxDiff < 1e-10:
        BREAK (konvergen)

return current
```

**Mengapa dipangkatkan?**
Karena pangkat dari stochastic matrix akan konvergen ke matriks stasioner dimana setiap baris dalam satu kolom memiliki nilai yang sama. Nilai inilah yang merepresentasikan **bobot prioritas jangka panjang** dengan mempertimbangkan semua dependency.

**Implementasi:** `buildLimitSupermatrix()` + `multiplyMatrix()` di [anp.helper.ts](../src/modules/anp/anp.helper.ts)

---

### Step 7: Ekstrak Final Weights

**Tujuan:** Mengambil satu vektor bobot final dari limit supermatrix.

**Formula:**

$$w_{\text{final},i} = \frac{1}{n} \sum_{j=1}^{n} L[i][j]$$

**Langkah:**
1. Rata-ratakan setiap **baris** pada limit matrix
2. Normalisasi agar jumlah total = 1 (antisipasi floating point drift)

```
weightSum = sum(finalWeights)
normalizedFinalWeights[i] = finalWeights[i] / weightSum
```

**Implementasi:** `extractFinalWeights()` di [anp.helper.ts](../src/modules/anp/anp.helper.ts)

---

### Step 8: Normalisasi Nilai Alternatif

**Tujuan:** Mengubah nilai kriteria tiap mobil menjadi skala [0, 1] yang sebanding.

Normalisasi berbeda tergantung **tipe kriteria**:

#### Benefit (semakin besar semakin baik)
Kriteria: `ENGINE_CAPACITY`, `SEAT_CAPACITY`, `FUEL_EFFICIENCY`

$$\text{norm}_{i} = \frac{v_i}{v_{\max}}$$

#### Cost (semakin kecil semakin baik)
Kriteria: `PRICE`, `MILEAGE`

$$\text{norm}_{i} = \frac{v_{\min}}{v_i}$$

**Contoh:**

```
Data Harga (Cost): [150jt, 200jt, 250jt]
minPrice = 150jt

normPrice[0] = 150/150 = 1.000  ← paling murah, skor tertinggi
normPrice[1] = 150/200 = 0.750
normPrice[2] = 150/250 = 0.600  ← paling mahal, skor terendah
```

```
Data Mesin (Benefit): [1500cc, 2000cc, 2500cc]
maxEngine = 2500cc

normEngine[0] = 1500/2500 = 0.600
normEngine[1] = 2000/2500 = 0.800
normEngine[2] = 2500/2500 = 1.000  ← paling besar, skor tertinggi
```

**Implementasi:** `normalizeBenefit()` dan `normalizeCost()` di [anp.helper.ts](../src/modules/anp/anp.helper.ts)

---

### Step 9: Hitung Final Score

**Tujuan:** Menggabungkan semua nilai normalisasi dengan bobot ANP.

**Formula:**

$$\text{Score}_i = \sum_{j=1}^{n} \text{norm}_{ij} \times w_{\text{final},j}$$

**Untuk Mobil Bekas:**

$$\text{Score} = \text{norm\_price} \times w_0 + \text{norm\_mileage} \times w_1 + \text{norm\_engine} \times w_2 + \text{norm\_seat} \times w_3$$

**Contoh:**

```
Bobot Final ANP: [w_price=0.12, w_mileage=0.04, w_engine=0.55, w_seat=0.29]

Mobil A:
  norm_price   = 0.80
  norm_mileage = 0.70
  norm_engine  = 1.00
  norm_seat    = 0.75

Score_A = (0.80 × 0.12) + (0.70 × 0.04) + (1.00 × 0.55) + (0.75 × 0.29)
        = 0.096 + 0.028 + 0.550 + 0.2175
        = 0.8915
```

---

### Step 10: Ranking Alternatif

**Tujuan:** Mengurutkan semua alternatif dari yang terbaik ke terburuk.

```
Urutkan results[] berdasarkan final_score secara DESCENDING

Rank 1 = skor tertinggi (alternatif terbaik)
Rank n = skor terendah (alternatif terburuk)
```

---

## 7. Contoh Perhitungan — Mobil Bekas

### Data Input (3 mobil)

| Mobil | Harga | Mileage | Mesin (cc) | Kursi |
|-------|-------|---------|------------|-------|
| Toyota Avanza | 150 jt | 80.000 km | 1500 | 7 |
| Honda HRV | 220 jt | 45.000 km | 1800 | 5 |
| Mitsubishi Pajero | 350 jt | 60.000 km | 2500 | 7 |

### Langkah 1–3: Eigenvector & Konsistensi

Menggunakan matriks default yang telah dijelaskan di atas.

Hasil eigenvector global (approx):
```
w_price   = 0.122
w_mileage = 0.049
w_engine  = 0.558
w_seat    = 0.271
```

### Langkah 4–7: Supermatrix & Final Weights

Setelah mempertimbangkan dependency (PRICE ← MILEAGE, ENGINE; MILEAGE ← PRICE), bobot ANP final dapat sedikit berbeda dari eigenvector global. Final weights menggambarkan pengaruh jangka panjang dalam jaringan dependency.

### Langkah 8: Normalisasi Alternatif

```
minPrice   = 150jt     | minMileage = 45.000
maxEngine  = 2500cc    | maxSeat    = 7

Avanza:
  norm_price   = 150/150   = 1.000
  norm_mileage = 45000/80000 = 0.563
  norm_engine  = 1500/2500 = 0.600
  norm_seat    = 7/7       = 1.000

HRV:
  norm_price   = 150/220   = 0.682
  norm_mileage = 45000/45000 = 1.000
  norm_engine  = 1800/2500 = 0.720
  norm_seat    = 5/7       = 0.714

Pajero:
  norm_price   = 150/350   = 0.429
  norm_mileage = 45000/60000 = 0.750
  norm_engine  = 2500/2500 = 1.000
  norm_seat    = 7/7       = 1.000
```

### Langkah 9–10: Final Score & Ranking

```
Score = norm_price × 0.122 + norm_mileage × 0.049 + norm_engine × 0.558 + norm_seat × 0.271

Avanza  = (1.000×0.122) + (0.563×0.049) + (0.600×0.558) + (1.000×0.271) = 0.754
HRV     = (0.682×0.122) + (1.000×0.049) + (0.720×0.558) + (0.714×0.271) = 0.722
Pajero  = (0.429×0.122) + (0.750×0.049) + (1.000×0.558) + (1.000×0.271) = 0.919
```

**Ranking:**
| Rank | Mobil | Score |
|------|-------|-------|
| 1 | Mitsubishi Pajero | 0.919 |
| 2 | Toyota Avanza | 0.754 |
| 3 | Honda HRV | 0.722 |

> **Catatan:** Nilai bobot ANP final aktual dihitung dari limit supermatrix dan mungkin berbeda dengan eigenvector global di atas karena efek dependency.

---

## 8. Modul Mobil Baru (New Cars)

### Perbedaan dari Mobil Bekas

| Aspek | Mobil Bekas | Mobil Baru |
|-------|-------------|------------|
| Kriteria ke-4 | Mileage | Efisiensi BBM |
| Prioritas harga | Ketiga | Pertama |
| Dependency network | PRICE←{MILEAGE,ENGINE}; MILEAGE←{PRICE} | PRICE←{ENGINE,SEAT,FUEL}; FUEL←{ENGINE} |

### Dependency Relations — Mobil Baru

```
                    ┌──────────────┐
                    │    PRICE     │ ◄─── ENGINE, SEAT, FUEL
                    └──────────────┘
                         ▲
        ┌────────────────┼──────────┐
        │                │          │
   ENGINE ──────────► FUEL        SEAT
    (1)                (2)          (3)

Visual dependency:
ENGINE ──► PRICE
ENGINE ──► FUEL ──► PRICE
SEAT   ──► PRICE
```

### Matriks Dependency Mobil Baru

**Kolom 0 (PRICE) dipengaruhi ENGINE, SEAT, FUEL:**

|  | ENGINE | SEAT | FUEL |
|--|--------|------|------|
| **ENGINE** | 1 | 3 | 1 |
| **SEAT** | 1/3 | 1 | 1/3 |
| **FUEL** | 1 | 3 | 1 |

**Kolom 3 (FUEL) dipengaruhi ENGINE:**

|  | ENGINE |
|--|--------|
| **ENGINE** | 1 |

---

## 9. Dependency Relations

### Mengapa Dependency Penting?

Dalam dunia nyata, kriteria tidak berdiri sendiri:
- **Harga ↔ Kapasitas Mesin:** Mesin yang lebih besar → harga lebih tinggi
- **Harga ↔ Mileage:** Mileage tinggi → kondisi lebih buruk → harga lebih rendah
- **Mileage ↔ Harga:** Harga tinggi sering mencerminkan mobil dengan mileage rendah

Tanpa memodelkan dependency ini, sistem akan memberikan bobot yang kurang akurat.

### Cara Kerja Dependency dalam Kode

```
DEPENDENCY_INFLUENCERS = {
  0: [1, 2],  // kolom PRICE dipengaruhi baris MILEAGE dan ENGINE
  1: [0],     // kolom MILEAGE dipengaruhi baris PRICE
}

Untuk kolom j dengan dependency:
  1. Ambil dependencyMatrices[j]  (matriks lokal influencer-influencer)
  2. Normalisasi matriks lokal tersebut
  3. Hitung eigenvector lokal
  4. Isi HANYA baris yang sesuai influencer dengan bobot lokal tersebut
  5. Baris lain = 0

Untuk kolom j tanpa dependency:
  → Isi seluruh kolom dengan eigenvector global
```

---

## 10. Penjelasan Output API

Response dari `GET /api/v1/anp/calculate`:

```json
{
  "success": true,
  "message": "Perhitungan ANP berhasil",
  "data": {
    "consistency": {
      "lambdaMax": 4.xxx,
      "consistencyIndex": 0.0xx,
      "consistencyRatio": 0.0xx,
      "isConsistent": true
    },
    "matrices": {
      "pairwise": [[...], ...],
      "normalized": [[...], ...],
      "unweighted_supermatrix": [[...], ...],
      "weighted_supermatrix": [[...], ...],
      "limit_supermatrix": [[...], ...]
    },
    "weights": [
      {
        "criteria_code": "PRICE",
        "criteria_name": "Harga",
        "weight": 0.122xxx
      },
      {
        "criteria_code": "ENGINE_CAPACITY",
        "criteria_name": "Kapasitas Mesin",
        "weight": 0.558xxx
      }
    ],
    "rankings": [
      {
        "rank_position": 1,
        "data_car": { "brand": "...", "model": "...", ... },
        "normalized_scores": {
          "price": 0.850,
          "mileage": 0.750,
          "engine_capacity": 1.000,
          "seat_capacity": 1.000
        },
        "final_score": 0.919,
        "calculated_at": "2026-06-08T..."
      }
    ]
  }
}
```

### Penjelasan Field

| Field | Keterangan |
|-------|------------|
| `consistency.consistencyRatio` | CR harus ≤ 0.1 agar sistem bisa jalan |
| `matrices.pairwise` | Matriks input perbandingan berpasangan |
| `matrices.unweighted_supermatrix` | Supermatrix sebelum normalisasi kolom |
| `matrices.weighted_supermatrix` | Supermatrix setelah normalisasi (column stochastic) |
| `matrices.limit_supermatrix` | Supermatrix setelah konvergensi (W^∞) |
| `weights[].weight` | Bobot ANP final tiap kriteria (sum ≈ 1) |
| `rankings[].normalized_scores` | Nilai tiap kriteria yang sudah dinormalisasi [0,1] |
| `rankings[].final_score` | Skor gabungan = Σ(norm_value × weight) |
| `rankings[].rank_position` | Peringkat (1 = terbaik) |

---

## 11. Referensi

- **Saaty, T.L. (1996).** Decision Making with Dependence and Feedback: The Analytic Network Process. RWS Publications, Pittsburgh.
- **Saaty, T.L. (1980).** The Analytic Hierarchy Process. McGraw-Hill, New York.

### Lokasi File Kode

| Komponen | File |
|----------|------|
| Tipe data | [src/modules/anp/anp.type.ts](../src/modules/anp/anp.type.ts) |
| Konstanta & matriks default | [src/modules/anp/anp.constant.ts](../src/modules/anp/anp.constant.ts) |
| Fungsi kalkulasi inti | [src/modules/anp/anp.helper.ts](../src/modules/anp/anp.helper.ts) |
| Business logic | [src/modules/anp/anp.service.ts](../src/modules/anp/anp.service.ts) |
| HTTP handler | [src/modules/anp/anp.controller.ts](../src/modules/anp/anp.controller.ts) |
| Konstanta mobil baru | [src/modules/newCars/newCar-anp.constant.ts](../src/modules/newCars/newCar-anp.constant.ts) |
| Service mobil baru | [src/modules/newCars/newCar.service.ts](../src/modules/newCars/newCar.service.ts) |

---

*Dokumen ini dibuat berdasarkan implementasi kode aktual pada proyek SPK Mobil Bekas (ANP).*
