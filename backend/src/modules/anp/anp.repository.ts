import { CarModel } from '../cars/car.model';
import { ICar } from '../cars/car.type';

export interface AnpFilter {
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
}

class AnpRepository {
  async findActiveCars(filter?: AnpFilter): Promise<ICar[]> {
    const query: Record<string, unknown> = { is_active: true };

    if (filter?.minPrice !== undefined || filter?.maxPrice !== undefined) {
      const priceFilter: Record<string, number> = {};
      if (filter?.minPrice !== undefined) priceFilter.$gte = filter.minPrice;
      if (filter?.maxPrice !== undefined) priceFilter.$lte = filter.maxPrice;
      query.price = priceFilter;
    }

    if (filter?.minYear !== undefined || filter?.maxYear !== undefined) {
      const yearFilter: Record<string, number> = {};
      if (filter?.minYear !== undefined) yearFilter.$gte = filter.minYear;
      if (filter?.maxYear !== undefined) yearFilter.$lte = filter.maxYear;
      query.year = yearFilter;
    }

    return CarModel.find(query).lean();
  }
}

export const anpRepository = new AnpRepository();
