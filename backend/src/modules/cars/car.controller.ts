import { ApiResponse } from '@/types/api-response.type';
import { Request, Response } from 'express';
import { CreateCarDTO, ICar } from './car.type';
import { carService } from './car.service';
import { HTTP_CODE } from '@/common/error/http';

class CarController {
  async getCarController(_req: Request, res: Response<ApiResponse<ICar[]>>) {
    const result = await carService.getCarsService();

    res.status(HTTP_CODE.OK).json({
      success: true,
      message: 'Berhasil mengambil data mobil',
      data: result,
    });
  }

  async getCarByIdController(req: Request, res: Response<ApiResponse<ICar>>) {
    const { id } = req.params;

    const result = await carService.getCarByIdService(id);

    res.status(HTTP_CODE.OK).json({
      success: true,
      message: 'Berhasil mengambil data mobil',
      data: result,
    });
  }

  async createCarController(req: Request, res: Response<ApiResponse<ICar>>) {
    const payload = res.locals.body as CreateCarDTO;
    const authUser = (req as any).user;

    const imagUrlString = (req as any).file
      ? `${(req as any).file.filename}`
      : '';

    const sanitizePayload = {
      ...payload,
      image_url: imagUrlString,
    };

    const result = await carService.createCarService(
      sanitizePayload,
      authUser.sub,
    );

    res.status(HTTP_CODE.OK).json({
      success: true,
      message: 'Berhasil menambahkan data mobil',
      data: result,
    });
  }

  async deleteCarController(req: Request, res: Response<ApiResponse<ICar>>) {
    const { id } = req.params;

    const result = await carService.deleteCarService(id);

    res.status(HTTP_CODE.OK).json({
      success: true,
      message: 'Berhasil menghapus data mobil',
      data: result,
    });
  }
}

export const carController = new CarController();
