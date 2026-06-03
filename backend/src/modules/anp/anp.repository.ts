import { CarModel } from '../cars/car.model';
import { ICar } from '../cars/car.type';

class AnpRepository {
  async findActiveCars(): Promise<ICar[]> {
    return CarModel.find({ is_active: true }).lean();
  }
}

export const anpRepository = new AnpRepository();
