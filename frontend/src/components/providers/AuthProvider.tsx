'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import type { AdminUser } from '@/types/auth.type';

function readUserCookie(): AdminUser | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|; )user_info=([^;]*)/);
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match[1])) as AdminUser;
  } catch {
    return null;
  }
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    const user = readUserCookie();
    if (user) setUser(user);
  }, [setUser]);

  return <>{children}</>;
}
