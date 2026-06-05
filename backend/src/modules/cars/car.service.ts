import { AppError } from '@/common/error/appError';
import { carRepository } from './car.repository';
import { CreateCarDTO, ICar, UpdateCarDTO } from './car.type';
import { ERROR_CODE, HTTP_CODE } from '@/common/error/http';
import { deleteImageFile } from '@/common/lib/multer';

class CarService {
  async getCarsService(): Promise<ICar[]> {
    return carRepository.findAllCars();
  }

  async getCarByIdService(id: string): Promise<ICar> {
    if (!id) {
      throw new AppError(
        'Id car tidak ditemukan, tolong sertakan id car',
        HTTP_CODE.BAD_REQUEST,
        ERROR_CODE.BAD_REQUEST,
      );
    }

    const result = await carRepository.findCarById(id);

    if (!result) {
      throw new AppError(
        'Data mobil tidak ditemukan',
        HTTP_CODE.NOT_FOUND,
        ERROR_CODE.NOT_FOUND,
      );
    }

    return result;
  }

  async createCarService(
    payload: CreateCarDTO,
    adminId: string,
  ): Promise<ICar> {
    if (!adminId) {
      throw new AppError(
        'Tidak ada id admin, silahkan login terlebih dahulu',
        HTTP_CODE.UNAUTHORIZED,
        ERROR_CODE.UNAUTHORIZED,
      );
    }

    if (payload.year > new Date().getFullYear()) {
      throw new AppError(
        'Tahun tidak boleh lebih dari tahun saat ini',
        HTTP_CODE.BAD_REQUEST,
        ERROR_CODE.BAD_REQUEST,
      );
    }

    const newCar = await carRepository.addCar(payload, adminId);

    return newCar;
  }

  async getCarByIdAdminService(id: string): Promise<ICar> {
    const result = await carRepository.findCarByIdAdmin(id);
    if (!result) {
      throw new AppError('Data mobil tidak ditemukan', HTTP_CODE.NOT_FOUND, ERROR_CODE.NOT_FOUND);
    }
    return result;
  }

  async updateCarService(id: string, payload: UpdateCarDTO, adminId: string): Promise<ICar> {
    if (!id) {
      throw new AppError('Id car tidak ditemukan', HTTP_CODE.BAD_REQUEST, ERROR_CODE.BAD_REQUEST);
    }

    const existing = await carRepository.findCarByIdAdmin(id);
    if (!existing) {
      throw new AppError('Data mobil tidak ditemukan', HTTP_CODE.NOT_FOUND, ERROR_CODE.NOT_FOUND);
    }

    const updated = await carRepository.updateCar(id, {
      ...payload,
      updated_by: adminId as any,
    });

    if (!updated) {
      throw new AppError('Gagal memperbarui data mobil', HTTP_CODE.INTERNAL_SERVER, ERROR_CODE.INTERNAL_SERVER);
    }

    return updated;
  }

  async deleteCarService(id: string): Promise<ICar> {
    if (!id) {
      throw new AppError(
        'Id car tidak ditemukan, tolong sertakan id car',
        HTTP_CODE.BAD_REQUEST,
        ERROR_CODE.BAD_REQUEST,
      );
    }

    const result = await carRepository.findCarById(id);

    if (!result) {
      throw new AppError(
        'Data mobil tidak ditemukan',
        HTTP_CODE.NOT_FOUND,
        ERROR_CODE.NOT_FOUND,
      );
    }

    // Delete image from disk before removing DB record
    if (result.image_url) {
      deleteImageFile(result.image_url);
    }

    const deleteCar = await carRepository.deleteCar(id);
    if (!deleteCar) {
      throw new AppError(
        'Data mobil tidak ditemukan',
        HTTP_CODE.NOT_FOUND,
        ERROR_CODE.NOT_FOUND,
      );
    }

    return deleteCar;
  }
}

export const carService = new CarService();
