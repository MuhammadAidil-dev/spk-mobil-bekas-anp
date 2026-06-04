import { Types } from 'mongoose';
import { AppError } from '@/common/error/appError';
import { ERROR_CODE, HTTP_CODE } from '@/common/error/http';

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
} from '../anp/anp.helper';
import {
  CreateNewCarDto,
  INewCar,
  NewCarDetail,
  NewCarListItem,
  UpdateNewCarDto,
} from './newCar.type';
import {
  newCarANPResultRepository,
  newCarRepository,
} from './newCar.repository';
import {
  NEW_CAR_CRITERIA,
  NEW_CAR_CRITERIA_COUNT,
  NEW_CAR_CRITERIA_INDEX,
  NEW_CAR_DEPENDENCY_INFLUENCERS,
  NEW_CAR_DEPENDENCY_MATRICES,
  NEW_CAR_PAIRWISE_MATRIX,
} from './newCar-anp.constant';

// ============================================================
// RETURN TYPES (internal service)
// ============================================================
interface AnpWeightItem {
  criteria_code: string;
  criteria_name: string;
  type: 'cost' | 'benefit';
  weight: number;
}

interface AnpRankingItem {
  rank_position: number;
  data_cars: INewCar;
  normalized_scores: {
    price: number;
    engine: number;
    seat: number;
    fuel: number;
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
// MAPPER — INewCar → NewCarListItem / NewCarDetail
// ============================================================
const toListItem = (car: INewCar): NewCarListItem => ({
  id: (car._id as { toString(): string }).toString(),
  brand: car.brand,
  model: car.model,
  year: car.year,
  price: car.price,
  engine_capacity: car.engine_capacity,
  seat_capacity: car.seat_capacity,
  fuel_efficiency: car.fuel_efficiency,
  transmission: car.transmission,
  fuel_type: car.fuel_type,
  color: car.color,
  image_url: car.image_url,
  description: car.description,
  is_active: car.is_active,
});

const toDetail = (car: INewCar): NewCarDetail => ({
  ...toListItem(car),
  created_by: car.created_by.toString(),
  updated_by: car.updated_by?.toString() ?? null,
  created_at: car.created_at,
  updated_at: car.updated_at,
});

// ============================================================
// NEW CAR SERVICE
// ============================================================
class NewCarService {
  // ----------------------------------------------------------
  // CRUD
  // ----------------------------------------------------------
  async create(dto: CreateNewCarDto): Promise<NewCarDetail> {
    const car = await newCarRepository.create(dto);
    return toDetail(car);
  }

  async findAll(): Promise<NewCarListItem[]> {
    const cars = await newCarRepository.findAll();
    return cars.map(toListItem);
  }

  async findById(id: string): Promise<NewCarDetail> {
    const car = await newCarRepository.findById(id);

    if (!car) {
      throw new AppError(
        'Mobil baru tidak ditemukan',
        HTTP_CODE.NOT_FOUND,
        ERROR_CODE.NOT_FOUND,
      );
    }

    return toDetail(car);
  }

  async update(id: string, dto: UpdateNewCarDto): Promise<NewCarDetail> {
    const exists = await newCarRepository.existsById(id);

    if (!exists) {
      throw new AppError(
        'Mobil baru tidak ditemukan',
        HTTP_CODE.NOT_FOUND,
        ERROR_CODE.NOT_FOUND,
      );
    }

    const updated = await newCarRepository.updateById(id, dto);

    return toDetail(updated!);
  }

  async remove(id: string): Promise<void> {
    const exists = await newCarRepository.existsById(id);

    if (!exists) {
      throw new AppError(
        'Mobil baru tidak ditemukan',
        HTTP_CODE.NOT_FOUND,
        ERROR_CODE.NOT_FOUND,
      );
    }

    await newCarRepository.deleteById(id);
  }

  // ----------------------------------------------------------
  // ANP CALCULATION
  //
  // Menggunakan shared anp.helper — tidak duplikasi logika.
  // Perbedaan dari domain mobil bekas:
  //   - Kriteria: PRICE, ENGINE, SEAT, FUEL (bukan MILEAGE)
  //   - Dependency: ENGINE→PRICE, ENGINE→FUEL, FUEL→PRICE, SEAT→PRICE
  //   - FUEL adalah kriteria benefit (semakin tinggi = lebih baik)
  // ----------------------------------------------------------
  async calculateRanking(): Promise<AnpCalculationResult> {
    // Ambil data mobil aktif
    const cars = await newCarRepository.findActive();

    if (!cars.length) {
      throw new AppError(
        'Tidak ada data mobil baru aktif',
        HTTP_CODE.NOT_FOUND,
        ERROR_CODE.NOT_FOUND,
      );
    }

    // STEP 1 & 2: Normalisasi pairwise + hitung eigenvector global
    const pairwiseMatrix = NEW_CAR_PAIRWISE_MATRIX;
    const normalizedMatrix = normalizeMatrix(pairwiseMatrix);
    const globalEigenVector = calculateEigenVector(normalizedMatrix);

    // STEP 3: Cek konsistensi
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

    // STEP 4: Bangun unweighted supermatrix
    // Inject dependency influencers khusus domain new-car
    const unweightedSupermatrix = buildUnweightedSupermatrixWithConfig(
      globalEigenVector,
      NEW_CAR_DEPENDENCY_MATRICES,
      NEW_CAR_DEPENDENCY_INFLUENCERS,
      NEW_CAR_CRITERIA_COUNT,
    );

    // STEP 5: Bangun weighted supermatrix
    const weightedSupermatrix = buildWeightedSupermatrix(
      unweightedSupermatrix,
      globalEigenVector,
    );

    // STEP 6: Bangun limit supermatrix
    const limitSupermatrix = buildLimitSupermatrix(weightedSupermatrix);

    // STEP 7: Ekstrak final weights
    const finalWeights = extractFinalWeights(limitSupermatrix);

    // STEP 8: Normalisasi final weights (antisipasi floating point drift)
    const weightSum = finalWeights.reduce((acc, w) => acc + w, 0);
    const normalizedFinalWeights =
      weightSum === 0 ? finalWeights : finalWeights.map((w) => w / weightSum);

    // STEP 9: Scoring alternatif
    const priceValues = cars.map((c) => c.price);
    const engineValues = cars.map((c) => c.engine_capacity);
    const seatValues = cars.map((c) => c.seat_capacity);
    const fuelValues = cars.map((c) => c.fuel_efficiency);

    const minPrice = Math.min(...priceValues);
    const maxEngine = Math.max(...engineValues);
    const maxSeat = Math.max(...seatValues);
    const maxFuel = Math.max(...fuelValues);

    const results = cars.map((car) => {
      const normalizedPrice = normalizeCost(car.price, minPrice);
      const normalizedEngine = normalizeBenefit(car.engine_capacity, maxEngine);
      const normalizedSeat = normalizeBenefit(car.seat_capacity, maxSeat);
      const normalizedFuel = normalizeBenefit(car.fuel_efficiency, maxFuel);

      // Final score = weighted sum sesuai urutan CRITERIA_INDEX
      const finalScore =
        normalizedPrice * normalizedFinalWeights[NEW_CAR_CRITERIA_INDEX.PRICE] +
        normalizedEngine *
          normalizedFinalWeights[NEW_CAR_CRITERIA_INDEX.ENGINE] +
        normalizedSeat * normalizedFinalWeights[NEW_CAR_CRITERIA_INDEX.SEAT] +
        normalizedFuel * normalizedFinalWeights[NEW_CAR_CRITERIA_INDEX.FUEL];

      return {
        data_cars: { ...car },

        normalized_scores: {
          price: roundDecimal(normalizedPrice),
          engine: roundDecimal(normalizedEngine),
          seat: roundDecimal(normalizedSeat),
          fuel: roundDecimal(normalizedFuel),
        },
        final_score: roundDecimal(finalScore),
      };
    });

    // STEP 10: Ranking — urutkan skor tertinggi ke terendah
    const rankedResults: AnpRankingItem[] = results
      .sort((a, b) => b.final_score - a.final_score)
      .map((item, index) => ({
        ...item,
        rank_position: index + 1,
        calculated_at: new Date(),
      }));

    // Simpan hasil ke DB (upsert per car_id)
    // await newCarANPResultRepository.deleteAll();
    // await Promise.all(
    //   rankedResults.map((item) =>
    //     newCarANPResultRepository.upsertByCarId(
    //       new Types.ObjectId(item.car_id),
    //       item.final_score,
    //       item.rank_position,
    //     ),
    //   ),
    // );

    // Susun output weights
    const weights: AnpWeightItem[] = NEW_CAR_CRITERIA.map((c) => ({
      criteria_code: c.code,
      criteria_name: c.name,
      type: c.type,
      weight: roundDecimal(
        normalizedFinalWeights[NEW_CAR_CRITERIA_INDEX[c.code]] ?? 0,
      ),
    }));

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

  // ----------------------------------------------------------
  // GET LATEST RANKING (dari DB, tanpa kalkulasi ulang)
  // ----------------------------------------------------------
  //   async getLatestRanking(): Promise<INewCar[]> {
  //     const results = await newCarANPResultRepository.findAllOrderedByRank();

  //     if (!results.length) {
  //       throw new AppError(
  //         'Belum ada hasil ranking. Jalankan proses ANP terlebih dahulu.',
  //         HTTP_CODE.NOT_FOUND,
  //         ERROR_CODE.NOT_FOUND,
  //       );
  //     }

  //     return results;
  //   }
}

// ============================================================
// HELPER INTERNAL — buildUnweightedSupermatrix dengan config
//
// Wrapper yang menerima dependency config sebagai parameter
// agar tidak bergantung pada DEPENDENCY_INFLUENCERS global
// dari domain mobil bekas.
// ============================================================
function buildUnweightedSupermatrixWithConfig(
  globalEigenVector: number[],
  dependencyMatrices: Record<number, number[][]>,
  dependencyInfluencers: Record<number, number[]>,
  criteriaCount: number,
): Matrix {
  const supermatrix: Matrix = Array.from({ length: criteriaCount }, () =>
    Array(criteriaCount).fill(0),
  );

  for (let col = 0; col < criteriaCount; col++) {
    const influencers = dependencyInfluencers[col];

    if (influencers && dependencyMatrices[col]) {
      const depMatrix = dependencyMatrices[col];

      // Normalisasi dependency matrix lokal
      const colTotals = Array(depMatrix[0].length).fill(0) as number[];
      for (let c = 0; c < depMatrix[0].length; c++) {
        for (let r = 0; r < depMatrix.length; r++) {
          colTotals[c] += depMatrix[r][c];
        }
      }
      const normalizedDep = depMatrix.map((row) =>
        row.map((val, ci) => (colTotals[ci] === 0 ? 0 : val / colTotals[ci])),
      );

      // Hitung eigenvector lokal
      const localEigenVector = normalizedDep.map((row) => {
        const total = row.reduce((acc, v) => acc + v, 0);
        return total / row.length;
      });

      // Isi baris influencer
      influencers.forEach((rowIndex, i) => {
        supermatrix[rowIndex][col] = localEigenVector[i] ?? 0;
      });
    } else {
      // Tidak ada dependency → gunakan eigenvector global
      for (let row = 0; row < criteriaCount; row++) {
        supermatrix[row][col] = globalEigenVector[row];
      }
    }
  }

  return supermatrix;
}

export const newCarService = new NewCarService();
