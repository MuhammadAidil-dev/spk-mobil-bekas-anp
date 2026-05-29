import { Request, Response } from 'express';

import { anpService } from './anp.service';
import { HTTP_CODE } from '@/common/error/http';

class AnpController {
  calculateRanking = async (_req: Request, res: Response) => {
    const result = await anpService.calculateRanking();

    res.status(HTTP_CODE.OK).json({
      success: true,
      message: 'ANP ranking calculated successfully',
      data: result,
    });
  };
}

export const anpController = new AnpController();
