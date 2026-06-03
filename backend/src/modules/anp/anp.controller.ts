import { Request, Response } from 'express';
import { anpService } from './anp.service';
import { HTTP_CODE } from '@/common/error/http';

class AnpController {
  calculateRanking = async (_req: Request, res: Response): Promise<void> => {
    const result = await anpService.calculateRanking();

    res.status(HTTP_CODE.OK).json({
      success: true,
      message: 'Perhitungan ANP berhasil',
      data: result,
    });
  };
}

export const anpController = new AnpController();
