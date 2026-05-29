import { ERROR_CODE, HTTP_CODE } from '@/common/error/http';
import { DEFAULT_PAIRWISE_MATRIX } from './anp.constant';

import {
  normalizeMatrix,
  calculateEigenVector,
  calculateConsistencyRatio,
  normalizeBenefit,
  normalizeCost,
} from './anp.helper';

import { anpRepository } from './anp.repository';

import { AppError } from '@/common/error/appError';
import { criteriaRepository } from '../criteria/criteria.repository';

class AnpService {
  async calculateRanking() {
    const [cars, criteria] = await Promise.all([
      anpRepository.findActiveCars(),
      criteriaRepository.findAll(),
    ]);

    if (!cars.length) {
      throw new AppError(
        'Cars not found',
        HTTP_CODE.NOT_FOUND,
        ERROR_CODE.NOT_FOUND,
      );
    }

    const normalizedMatrix = normalizeMatrix(DEFAULT_PAIRWISE_MATRIX);

    const eigenVector = calculateEigenVector(normalizedMatrix);

    const consistency = calculateConsistencyRatio(
      DEFAULT_PAIRWISE_MATRIX,
      eigenVector,
    );

    if (!consistency.isConsistent) {
      throw new AppError(
        'Pairwise matrix inconsistent',
        HTTP_CODE.BAD_REQUEST,
        ERROR_CODE.BAD_REQUEST,
      );
    }

    const priceValues = cars.map((car) => car.price);

    const mileageValues = cars.map((car) => car.mileage);

    const engineValues = cars.map((car) => car.engine_capacity);

    const seatValues = cars.map((car) => car.seat_capacity);

    const minPrice = Math.min(...priceValues);

    const minMileage = Math.min(...mileageValues);

    const maxEngine = Math.max(...engineValues);

    const maxSeat = Math.max(...seatValues);

    const results = cars.map((car) => {
      const normalizedPrice = normalizeCost(car.price, minPrice);

      const normalizedMileage = normalizeCost(car.mileage, minMileage);

      const normalizedEngine = normalizeBenefit(car.engine_capacity, maxEngine);

      const normalizedSeat = normalizeBenefit(car.seat_capacity, maxSeat);

      const finalScore =
        normalizedPrice * eigenVector[0] +
        normalizedMileage * eigenVector[1] +
        normalizedEngine * eigenVector[2] +
        normalizedSeat * eigenVector[3];

      return {
        car_id: car._id,
        car_name: `${car.brand} ${car.model}`,
        final_score: finalScore,
      };
    });

    const rankedResults = results
      .sort((a, b) => b.final_score - a.final_score)
      .map((item, index) => ({
        ...item,
        rank_position: index + 1,
        calculated_at: new Date(),
      }));

    return {
      consistency,
      weights: criteria.map((criteria, index) => ({
        criteria: criteria.code,
        weight: eigenVector[index],
      })),
      rankings: rankedResults,
    };
  }
}

export const anpService = new AnpService();
