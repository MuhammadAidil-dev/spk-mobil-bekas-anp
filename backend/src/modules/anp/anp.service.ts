import { ERROR_CODE, HTTP_CODE } from '@/common/error/http';
import { AppError } from '@/common/error/appError';

import {
  DEFAULT_PAIRWISE_MATRIX,
  DEFAULT_DEPENDENCY_MATRICES,
  CRITERIA_INDEX,
} from './anp.constant';

import {
  normalizeMatrix,
  calculateEigenVector,
  calculateConsistencyRatio,
  buildUnweightedSupermatrix,
  buildWeightedSupermatrix,
  buildLimitSupermatrix,
  extractFinalWeights,
  normalizeBenefit,
  normalizeCost,
  roundDecimal,
  Matrix,
} from './anp.helper';

import { anpRepository } from './anp.repository';
import { criteriaRepository } from '../criteria/criteria.repository';
import { ICar } from '../cars/car.type';

// ============================================================
// TIPE RETURN SERVICE
// ============================================================
interface AnpWeightItem {
  criteria_code: string;
  criteria_name: string;
  weight: number;
}

interface AnpRankingItem {
  rank_position: number;
  data_car: ICar;
  normalized_scores: {
    price: number;
    mileage: number;
    engine_capacity: number;
    seat_capacity: number;
  };
  final_score: number;
  calculated_at: Date;
}

interface AnpCalculationResult {
  consistency: {
    lambdaMax: number;
    consistencyIndex: number;
    consistencyRatio: number;
    isConsistent: boolean;
  };
  matrices: {
    pairwise: Matrix;
    normalized: Matrix;
    unweighted_supermatrix: Matrix;
    weighted_supermatrix: Matrix;
    limit_supermatrix: Matrix;
  };
  weights: AnpWeightItem[];
  rankings: AnpRankingItem[];
}

// ============================================================
// ANP SERVICE
// ============================================================
class AnpService {
  async calculateRanking(): Promise<AnpCalculationResult> {
    // ----------------------------------------------------------
    // Ambil data dari DB
    // ----------------------------------------------------------
    const [cars, criteria] = await Promise.all([
      anpRepository.findActiveCars(),
      criteriaRepository.findAll(),
    ]);

    if (!cars.length) {
      throw new AppError(
        'Tidak ada data mobil aktif',
        HTTP_CODE.NOT_FOUND,
        ERROR_CODE.NOT_FOUND,
      );
    }

    if (criteria.length !== 4) {
      throw new AppError(
        'Jumlah kriteria tidak valid, harus 4 kriteria',
        HTTP_CODE.BAD_REQUEST,
        ERROR_CODE.BAD_REQUEST,
      );
    }

    // ----------------------------------------------------------
    // STEP 1 & 2: Normalisasi pairwise matrix + Hitung eigenvector global
    // ----------------------------------------------------------
    const pairwiseMatrix = DEFAULT_PAIRWISE_MATRIX;
    const normalizedMatrix = normalizeMatrix(pairwiseMatrix);
    const globalEigenVector = calculateEigenVector(normalizedMatrix);

    // ----------------------------------------------------------
    // STEP 3: Cek konsistensi pairwise matrix
    // ----------------------------------------------------------
    const consistency = calculateConsistencyRatio(
      pairwiseMatrix,
      globalEigenVector,
    );

    if (!consistency.isConsistent) {
      throw new AppError(
        `Pairwise matrix tidak konsisten (CR=${roundDecimal(consistency.consistencyRatio, 4)}). Maksimal CR = 0.1`,
        HTTP_CODE.BAD_REQUEST,
        ERROR_CODE.BAD_REQUEST,
      );
    }

    // ----------------------------------------------------------
    // STEP 4: Bangun Unweighted Supermatrix
    // Menggunakan dependency relations untuk memodelkan
    // hubungan antar kriteria (inti ANP)
    // ----------------------------------------------------------
    const unweightedSupermatrix = buildUnweightedSupermatrix(
      globalEigenVector,
      DEFAULT_DEPENDENCY_MATRICES,
    );

    // ----------------------------------------------------------
    // STEP 5: Bangun Weighted Supermatrix
    // Normalisasi kolom supermatrix agar column stochastic
    // ----------------------------------------------------------
    const weightedSupermatrix = buildWeightedSupermatrix(
      unweightedSupermatrix,
      globalEigenVector,
    );

    // ----------------------------------------------------------
    // STEP 6: Bangun Limit Supermatrix
    // Pangkatkan weighted supermatrix hingga konvergen
    // ----------------------------------------------------------
    const limitSupermatrix = buildLimitSupermatrix(weightedSupermatrix);

    // ----------------------------------------------------------
    // STEP 7: Ekstrak final weights dari limit supermatrix
    // Ini bobot final yang sudah mempertimbangkan dependency
    // ----------------------------------------------------------
    const finalWeights = extractFinalWeights(limitSupermatrix);

    // ----------------------------------------------------------
    // STEP 8: Normalisasi final weights agar jumlah = 1
    // (antisipasi floating point drift setelah iterasi)
    // ----------------------------------------------------------
    const weightSum = finalWeights.reduce((acc, w) => acc + w, 0);
    const normalizedFinalWeights =
      weightSum === 0 ? finalWeights : finalWeights.map((w) => w / weightSum);

    // ----------------------------------------------------------
    // STEP 9: Scoring alternatif (mobil)
    //
    // Ambil nilai min/max untuk normalisasi
    // ----------------------------------------------------------
    const priceValues = cars.map((car) => car.price);
    const mileageValues = cars.map((car) => car.mileage);
    const engineValues = cars.map((car) => car.engine_capacity);
    const seatValues = cars.map((car) => car.seat_capacity);

    const minPrice = Math.min(...priceValues);
    const minMileage = Math.min(...mileageValues);
    const maxEngine = Math.max(...engineValues);
    const maxSeat = Math.max(...seatValues);

    // Hitung skor setiap mobil menggunakan bobot ANP final
    const results = cars.map((car) => {
      const normalizedPrice = normalizeCost(car.price, minPrice);
      const normalizedMileage = normalizeCost(car.mileage, minMileage);
      const normalizedEngine = normalizeBenefit(car.engine_capacity, maxEngine);
      const normalizedSeat = normalizeBenefit(car.seat_capacity, maxSeat);

      // Final score = weighted sum of normalized criteria values
      // Urutan weight sesuai CRITERIA_INDEX: [PRICE, MILEAGE, ENGINE, SEAT]
      const finalScore =
        normalizedPrice * normalizedFinalWeights[CRITERIA_INDEX.PRICE] +
        normalizedMileage * normalizedFinalWeights[CRITERIA_INDEX.MILEAGE] +
        normalizedEngine *
          normalizedFinalWeights[CRITERIA_INDEX.ENGINE_CAPACITY] +
        normalizedSeat * normalizedFinalWeights[CRITERIA_INDEX.SEAT_CAPACITY];

      return {
        data_car: { ...car },
        normalized_scores: {
          price: roundDecimal(normalizedPrice),
          mileage: roundDecimal(normalizedMileage),
          engine_capacity: roundDecimal(normalizedEngine),
          seat_capacity: roundDecimal(normalizedSeat),
        },
        final_score: roundDecimal(finalScore),
      };
    });

    // ----------------------------------------------------------
    // STEP 10: Ranking — urutkan skor tertinggi ke terendah
    // ----------------------------------------------------------
    const rankedResults: AnpRankingItem[] = results
      .sort((a, b) => b.final_score - a.final_score)
      .map((item, index) => ({
        ...item,
        rank_position: index + 1,
        calculated_at: new Date(),
      }));

    // ----------------------------------------------------------
    // Susun output
    // ----------------------------------------------------------
    const weights: AnpWeightItem[] = criteria
      .sort((a, b) => a.order - b.order)
      .map((c) => {
        const idx = CRITERIA_INDEX[c.code];
        return {
          criteria_code: c.code,
          criteria_name: c.name,
          weight: roundDecimal(normalizedFinalWeights[idx] ?? 0),
        };
      });

    return {
      consistency,
      matrices: {
        pairwise: pairwiseMatrix,
        normalized: normalizedMatrix,
        unweighted_supermatrix: unweightedSupermatrix,
        weighted_supermatrix: weightedSupermatrix,
        limit_supermatrix: limitSupermatrix,
      },
      weights,
      rankings: rankedResults,
    };
  }
}

export const anpService = new AnpService();
