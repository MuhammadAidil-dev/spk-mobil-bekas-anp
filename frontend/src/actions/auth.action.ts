'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { login } from '@/services/auth.service';

const TOKEN_KEY = 'accessToken';
const USER_KEY = 'user_info';

/**
 * Decode JWT exp claim (seconds) and return remaining seconds from now.
 * Falls back to 8 hours if the token is malformed.
 */
function getTokenMaxAge(token: string): number {
  try {
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64url').toString('utf-8'),
    ) as { exp?: number };
    if (!payload.exp) return 60 * 60 * 8;
    return Math.max(0, payload.exp - Math.floor(Date.now() / 1000));
  } catch {
    return 60 * 60 * 8;
  }
}

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const result = await login(email, password);
  if (!result.success) return result;

  const cookieStore = await cookies();
  const maxAge = getTokenMaxAge(result.data.accessToken);
  const cookieBase = {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge,
    path: '/',
  };

  cookieStore.set(TOKEN_KEY, result.data.accessToken, {
    ...cookieBase,
    httpOnly: true,
  });

  // Non-httpOnly cookie — only stores display info (name, email), no secrets
  cookieStore.set(
    USER_KEY,
    JSON.stringify({
      _id: result.data.user._id,
      name: result.data.user.name,
      email: result.data.user.email,
    }),
    { ...cookieBase, httpOnly: false },
  );

  redirect('/admin/dashboard');
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_KEY);
  cookieStore.delete(USER_KEY);
  redirect('/login');
}
