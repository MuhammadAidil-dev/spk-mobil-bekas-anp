import { Car } from './car.type';

export interface RankedCar {
  car: Car;
  score: number;
  rank: number;
}

export interface RecommendationSummary {
  totalCandidates: number;
  totalCriteria: number;
  consistencyRatio: number;
  processingTime: string;
}
