import { Types } from 'mongoose';
import {
  CreateNewCarDto,
  INewCar,
  INewCarANPResult,
  UpdateNewCarDto,
} from './newCar.type';
import { NewCarANPResultModel, NewCarModel } from './newCar.model';

export interface NewCarFilter {
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
}

// ============================================================
// NEW CAR REPOSITORY
// ============================================================
class NewCarRepository {
  // ----------------------------------------------------------
  // CRUD
  // ----------------------------------------------------------
  async create(dto: CreateNewCarDto): Promise<INewCar> {
    return NewCarModel.create(dto);
  }

  async findAll(): Promise<INewCar[]> {
    return NewCarModel.find().sort({ created_at: -1 }).lean();
  }

  async findActive(filter?: NewCarFilter): Promise<INewCar[]> {
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

    return NewCarModel.find(query).lean();
  }

  async findById(id: string): Promise<INewCar | null> {
    return NewCarModel.findById(id).lean();
  }

  async updateById(id: string, dto: UpdateNewCarDto): Promise<INewCar | null> {
    return NewCarModel.findByIdAndUpdate(id, dto, { new: true }).lean();
  }

  async deleteById(id: string): Promise<INewCar | null> {
    return NewCarModel.findByIdAndDelete(id).lean();
  }

  async existsById(id: string): Promise<boolean> {
    const count = await NewCarModel.countDocuments({ _id: id });
    return count > 0;
  }
}

// ============================================================
// NEW CAR ANP RESULT REPOSITORY
// ============================================================
class NewCarANPResultRepository {
  async upsertByCarId(
    carId: Types.ObjectId,
    finalScore: number,
    rankPosition: number,
  ): Promise<INewCarANPResult> {
    return NewCarANPResultModel.findOneAndUpdate(
      { car_id: carId },
      {
        car_id: carId,
        final_score: finalScore,
        rank_position: rankPosition,
        calculated_at: new Date(),
      },
      { upsert: true, new: true },
    ).lean() as Promise<INewCarANPResult>;
  }

  async findAllOrderedByRank(): Promise<INewCarANPResult[]> {
    return NewCarANPResultModel.find()
      .sort({ rank_position: 1 })
      .populate('car_id')
      .lean();
  }

  async deleteAll(): Promise<void> {
    await NewCarANPResultModel.deleteMany({});
  }
}

export const newCarRepository = new NewCarRepository();
export const newCarANPResultRepository = new NewCarANPResultRepository();
