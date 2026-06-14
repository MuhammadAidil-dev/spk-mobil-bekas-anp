import { Request, Response } from 'express';
import { anpService } from './anp.service';
import { AnpFilter } from './anp.repository';
import { HTTP_CODE } from '@/common/error/http';

class AnpController {
  calculateRanking = async (req: Request, res: Response): Promise<void> => {
    const { minPrice, maxPrice, minYear, maxYear } = req.query;

    const filter: AnpFilter = {};
    if (minPrice) filter.minPrice = Number(minPrice);
    if (maxPrice) filter.maxPrice = Number(maxPrice);
    if (minYear) filter.minYear = Number(minYear);
    if (maxYear) filter.maxYear = Number(maxYear);

    const result = await anpService.calculateRanking(
      Object.keys(filter).length ? filter : undefined,
    );

    res.status(HTTP_CODE.OK).json({
      success: true,
      message: 'Perhitungan ANP berhasil',
      data: result,
    });
  };
}

export const anpController = new AnpController();
