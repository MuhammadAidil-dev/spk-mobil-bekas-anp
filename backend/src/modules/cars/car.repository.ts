import { CarModel } from './car.model';
import { CreateCarDTO, ICar, UpdateCarDTO } from './car.type';

class CarRepository {
  async findAllCars(): Promise<ICar[]> {
    return CarModel.find({ is_active: true }).lean();
  }

  async findAllCarsAdmin(): Promise<ICar[]> {
    return CarModel.find().sort({ createdAt: -1 }).lean();
  }

  async findCarById(id: string): Promise<ICar | null> {
    return CarModel.findOne({ _id: id, is_active: true }).lean();
  }

  async findCarByIdAdmin(id: string): Promise<ICar | null> {
    return CarModel.findById(id).lean();
  }

  async addCar(payload: CreateCarDTO, adminId: string): Promise<ICar> {
    return CarModel.create({ ...payload, created_by: adminId });
  }

  async updateCar(id: string, payload: UpdateCarDTO): Promise<ICar | null> {
    return CarModel.findByIdAndUpdate(id, payload, { new: true }).lean();
  }

  async deleteCar(id: string): Promise<ICar | null> {
    return CarModel.findOneAndDelete({ _id: id });
  }
}

export const carRepository = new CarRepository();
