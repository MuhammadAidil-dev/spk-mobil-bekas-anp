'use client';

import { usePathname } from 'next/navigation';
import { LogOut, Menu } from 'lucide-react';
import { useTransition } from 'react';
import { logoutAction } from '@/actions/auth.action';
import { useAuthStore } from '@/store/auth.store';
import { useUIStore } from '@/store/ui.store';

const linkItems = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/cars', label: 'Car Management' },
  { href: '/admin/cars/add', label: 'Add Car' },
  { href: '/admin/new-cars', label: 'New Car Management' },
  { href: '/admin/new-cars/add', label: 'Add New Car' },
  { href: '/admin/anp-engine', label: 'ANP Engine' },
];

export default function AdminTopbar() {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const user = useAuthStore((s) => s.user);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  const label =
    linkItems.find((item) => item.href === pathname)?.label ?? 'Admin Panel';

  const initials = user?.name
    ? user.name
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase()
    : 'A';

  function handleLogout() {
    startTransition(async () => {
      await logoutAction();
    });
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-secondary/10 bg-white shadow-sm lg:ml-62.5">
      <nav className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center gap-3">
          {/* Hamburger — mobile only */}
          <button
            onClick={toggleSidebar}
            className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>

          <h2 className="text-base font-semibold text-black sm:text-lg">{label}</h2>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* User badge */}
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-2 py-1.5 sm:gap-3 sm:px-3 sm:py-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white sm:h-8 sm:w-8">
              {initials}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold leading-tight text-slate-800">
                {user?.name ?? 'Admin'}
              </p>
              <p className="text-xs leading-tight text-secondary">
                {user?.email ?? ''}
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            disabled={isPending}
            title="Logout"
            className="cursor-pointer rounded-xl border border-slate-200 p-2 transition hover:border-red-300 hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
          >
            <LogOut size={18} />
          </button>
        </div>
      </nav>
    </header>
  );
}
