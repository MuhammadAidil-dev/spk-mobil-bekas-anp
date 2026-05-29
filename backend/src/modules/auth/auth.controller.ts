import { ApiResponse } from '@/types/api-response.type';
import { Request, Response } from 'express';
import { IAdminResponse } from '../admin/admin.type';
import { LoginPayload } from './auth.type';
import { authService } from './auth.service';
import { HTTP_CODE } from '@/common/error/http';

const COOKIE_NAME = 'accessToken';
const eightHours = 8 * 60 * 60 * 1000; // 8 jam dalam milidetik (sesuaikan dengan JWT_EXPIRES_IN)
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'none' as const,
  maxAge: eightHours,
  path: '/',
};

type TLoginResult = {
  accessToken: string;
  user: IAdminResponse;
};

class AuthController {
  constructor() {}

  async loginController(
    _req: Request,
    res: Response<ApiResponse<TLoginResult>>,
  ) {
    const payload = res.locals.body as LoginPayload;

    const { accessToken, user } = await authService.loginService(payload);

    res.cookie(COOKIE_NAME, accessToken, cookieOptions);

    res.status(HTTP_CODE.OK).json({
      success: true,
      message: 'Berhasil Login',
      data: {
        accessToken,
        user,
      },
    });
  }
}

export const authController = new AuthController();
