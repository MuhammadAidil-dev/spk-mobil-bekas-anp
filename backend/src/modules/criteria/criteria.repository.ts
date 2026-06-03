import { Criteria } from './criteria.model';
import { ICriteria } from './criteria.type';

class CriteriaRepository {
  constructor() {}

  async findAll(): Promise<ICriteria[]> {
    return Criteria.find().sort({ order: 1 }).lean();
  }
}

export const criteriaRepository = new CriteriaRepository();
