import { Admin } from './admin.model';
import { IAdminDocument } from './admin.type';

class AdminRepository {
  constructor() {}

  async login(email: string): Promise<IAdminDocument | null> {
    return await Admin.findOne({
      email,
    }).select('+password_hash');
  }
}

export const adminRepository = new AdminRepository();
