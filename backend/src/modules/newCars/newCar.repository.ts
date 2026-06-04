import { Types } from 'mongoose';
import {
  CreateNewCarDto,
  INewCar,
  INewCarANPResult,
  UpdateNewCarDto,
} from './newCar.type';
import { NewCarANPResultModel, NewCarModel } from './newCar.model';

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

  async findActive(): Promise<INewCar[]> {
    return NewCarModel.find({ is_active: true }).lean();
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
