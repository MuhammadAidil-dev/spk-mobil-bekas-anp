import { AppError } from '@/common/error/appError';
import { adminRepository } from '../admin/admin.repository';

import { LoginPayload } from './auth.type';
import { ERROR_CODE, HTTP_CODE } from '@/common/error/http';
import { IAdminDocument, IAdminResponse } from '../admin/admin.type';
import { loadEnv } from '@/config/env';
import jwt, { SignOptions } from 'jsonwebtoken';

const env = loadEnv();

type TLoginResult = {
  accessToken: string;
  user: IAdminResponse;
};

class AuthService {
  private readonly JWT_SECRET: string;
  private readonly JWT_EXPIRED_IN: SignOptions['expiresIn'];

  constructor() {
    if (!env.JWT.SECRET) {
      throw Error('JWT Secret tidak ditemukan di env variable');
    }

    this.JWT_SECRET = env.JWT.SECRET;
    this.JWT_EXPIRED_IN = (env.JWT.EXPIRES_IN ??
      '8h') as SignOptions['expiresIn'];
  }

  async loginService(payload: LoginPayload): Promise<TLoginResult> {
    const { email, password } = payload;

    const user = await adminRepository.login(email);

    if (!user) {
      throw new AppError(
        'Akun tidak ditemukan',
        HTTP_CODE.NOT_FOUND,
        ERROR_CODE.NOT_FOUND,
      );
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new AppError(
        'Invalid Credential',
        HTTP_CODE.UNAUTHORIZED,
        ERROR_CODE.UNAUTHORIZED,
      );
    }

    // generate token
    const token = this.generateToken(user);

    // hilangkan password di user

    const { password: _pw, ...filteredUser } = user.toObject();

    return {
      accessToken: token,
      user: filteredUser,
    };
  }

  private generateToken(user: IAdminDocument): string {
    return jwt.sign(
      {
        sub: user._id,
        email: user.email,
      },
      this.JWT_SECRET,
      {
        expiresIn: this.JWT_EXPIRED_IN,
      },
    );
  }
}

export const authService = new AuthService();
