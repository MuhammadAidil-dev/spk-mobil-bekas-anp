'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { login } from '@/services/auth.service';

const TOKEN_KEY = 'accessToken';
const USER_KEY = 'user_info';
const TOKEN_MAX_AGE = 60 * 60 * 8; // 8 hours

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const result = await login(email, password);
  if (!result.success) return result;

  const cookieStore = await cookies();

  cookieStore.set(TOKEN_KEY, result.data.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: TOKEN_MAX_AGE,
    path: '/',
  });

  // Non-httpOnly cookie — only stores display info (name, email), no secrets
  cookieStore.set(
    USER_KEY,
    JSON.stringify({
      _id: result.data.user._id,
      name: result.data.user.name,
      email: result.data.user.email,
    }),
    {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: TOKEN_MAX_AGE,
      path: '/',
    },
  );

  redirect('/admin/dashboard');
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_KEY);
  cookieStore.delete(USER_KEY);
  redirect('/login');
}
