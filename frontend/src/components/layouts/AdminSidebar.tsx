'use client';

import {
  Car,
  CarFront,
  Laptop,
  LayoutDashboard,
  LucideIcon,
  MonitorCog,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { useUIStore } from '@/store/ui.store';

type NavItem = {
  href: string;
  icon: LucideIcon;
  label: string;
};

export const navItems: NavItem[] = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/cars', icon: Car, label: 'Mobil Bekas' },
  { href: '/admin/new-cars', icon: CarFront, label: 'Mobil Baru' },
  { href: '/admin/anp-engine', icon: MonitorCog, label: 'ANP Engine' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const { sidebarOpen, closeSidebar } = useUIStore();

  // Close drawer on navigation
  useEffect(() => {
    closeSidebar();
  }, [pathname, closeSidebar]);

  const initials = user?.name
    ? user.name
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase()
    : 'A';

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-40 flex h-full w-62.5 flex-col justify-between bg-white px-4 py-8 border border-secondary/10 shadow-sm transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="w-full">
          {/* Brand + mobile close */}
          <div className="mt-16 flex items-center gap-2 lg:mt-0">
            <span className="flex h-15 w-15 shrink-0 items-center justify-center rounded-md bg-primary">
              <Laptop size={24} color="white" />
            </span>
            <div className="flex min-w-0 flex-1 flex-col">
              <p className="truncate font-bold text-black text-base">
                ADMIN PANEL
              </p>
              <p className="truncate text-xs font-normal text-black">
                Decision Support System
              </p>
            </div>
            <button
              onClick={closeSidebar}
              className="ml-auto shrink-0 rounded-md p-1 text-black/50 transition hover:bg-primary/10 hover:text-black lg:hidden"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="mt-8 flex w-full flex-col gap-1">
            {navItems.map((item) => {
              const isActive = pathname.includes(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-all ${
                    isActive
                      ? 'bg-primary font-semibold text-white'
                      : 'text-black hover:bg-primary/10 hover:pl-4'
                  }`}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User info */}
        <div className="w-full border-t border-primary/20 pt-4">
          <div className="flex items-center gap-3 rounded-xl bg-white/60 px-3 py-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">
                {user?.name ?? '—'}
              </p>
              <p className="truncate text-xs text-secondary">
                {user?.email ?? ''}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
