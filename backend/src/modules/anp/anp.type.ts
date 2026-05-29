export type CriteriaType = 'cost' | 'benefit';

export interface CriteriaWeight {
  code: string;
  weight: number;
  type: CriteriaType;
}

export interface RankedCar {
  carId: string;
  carName: string;
  score: number;
  rank: number;
}

export interface MatrixConsistencyResult {
  consistencyIndex: number;
  consistencyRatio: number;
  isConsistent: boolean;
}
