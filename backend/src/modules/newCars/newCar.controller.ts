import { Request, Response } from 'express';
import { HTTP_CODE } from '@/common/error/http';
import { Types } from 'mongoose';
import { newCarService } from './newCar.service';
import { CreateNewCarDto } from './newCar.type';

// ============================================================
// NEW CAR CONTROLLER
// ============================================================
class NewCarController {
  // ----------------------------------------------------------
  // GET /new-cars
  // ----------------------------------------------------------
  findAll = async (_req: Request, res: Response): Promise<void> => {
    const data = await newCarService.findAll();

    res.status(HTTP_CODE.OK).json({
      success: true,
      message: 'Berhasil mengambil daftar mobil baru',
      data,
    });
  };

  // ----------------------------------------------------------
  // GET /new-cars/:id
  // ----------------------------------------------------------
  findById = async (req: Request, res: Response): Promise<void> => {
    const data = await newCarService.findById(req.params.id);

    res.status(HTTP_CODE.OK).json({
      success: true,
      message: 'Berhasil mengambil detail mobil baru',
      data,
    });
  };

  // ----------------------------------------------------------
  // POST /new-cars (Admin)
  // ----------------------------------------------------------
  create = async (req: Request, res: Response): Promise<void> => {
    const payload = res.locals.body as CreateNewCarDto;

    const user = (req as any).user as { id: string };
    const imageUrl = (req as any).file?.filename ?? payload.image_url ?? '';

    const data = await newCarService.create({
      ...payload,
      image_url: imageUrl,
      created_by: user?.id ? new Types.ObjectId(user.id) : null,
    });

    res.status(HTTP_CODE.CREATED).json({
      success: true,
      message: 'Mobil baru berhasil ditambahkan',
      data,
    });
  };

  // ----------------------------------------------------------
  // PATCH /new-cars/:id (Admin)
  // ----------------------------------------------------------
  update = async (req: Request, res: Response): Promise<void> => {
    const payload = res.locals.body as Partial<import('./newCar.type').UpdateNewCarDto>;
    const user = (req as any).user as { id: string };
    const existingCar = await newCarService.findById(req.params.id);

    const imageUrl = (req as any).file?.filename
      ? (req as any).file.filename
      : (payload.image_url ?? existingCar.image_url);

    const data = await newCarService.update(req.params.id, {
      ...payload,
      image_url: imageUrl,
      updated_by: new Types.ObjectId(user.id),
    });

    res.status(HTTP_CODE.OK).json({
      success: true,
      message: 'Mobil baru berhasil diperbarui',
      data,
    });
  };

  // ----------------------------------------------------------
  // DELETE /new-cars/:id (Admin)
  // ----------------------------------------------------------
  remove = async (req: Request, res: Response): Promise<void> => {
    await newCarService.remove(req.params.id);

    res.status(HTTP_CODE.OK).json({
      success: true,
      message: 'Mobil baru berhasil dihapus',
    });
  };

  // ----------------------------------------------------------
  // POST /new-cars/anp/calculate (Admin)
  // ----------------------------------------------------------
  calculateANP = async (_req: Request, res: Response): Promise<void> => {
    const data = await newCarService.calculateRanking();

    res.status(HTTP_CODE.OK).json({
      success: true,
      message: 'Perhitungan ANP mobil baru berhasil',
      data,
    });
  };

  // ----------------------------------------------------------
  // GET /new-cars/anp/ranking
  // ----------------------------------------------------------
  //   getRanking = async (_req: Request, res: Response): Promise<void> => {
  //     const data = await newCarService.getLatestRanking();

  //     res.status(HTTP_CODE.OK).json({
  //       success: true,
  //       message: 'Berhasil mengambil ranking mobil baru',
  //       data,
  //     });
  //   };
}

export const newCarController = new NewCarController();
