import { CarModel } from './car.model';
import { CreateCarDTO, ICar } from './car.type';

class CarRepository {
  async findAllCars(): Promise<ICar[]> {
    return CarModel.find({
      is_active: true,
    }).lean();
  }

  async findCarById(id: string): Promise<ICar | null> {
    return CarModel.findOne({
      _id: id,
      is_active: true,
    }).lean();
  }

  async addCar(payload: CreateCarDTO, adminId: string): Promise<ICar> {
    return CarModel.create({ ...payload, created_by: adminId });
  }

  async deleteCar(id: string): Promise<ICar | null> {
    return CarModel.findOneAndDelete({ _id: id });
  }
}

export const carRepository = new CarRepository();
