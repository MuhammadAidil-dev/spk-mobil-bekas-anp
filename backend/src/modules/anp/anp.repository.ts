import { CarModel } from '../cars/car.model';

class AnpRepository {
  async findActiveCars() {
    return CarModel.find({
      is_active: true,
    }).lean();
  }
}

export const anpRepository = new AnpRepository();
