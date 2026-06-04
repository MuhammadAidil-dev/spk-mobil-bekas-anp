'use client';

import {
  Car,
  Laptop,
  LayoutDashboard,
  LucideIcon,
  MonitorCog,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavItem = {
  href: string;
  icon: LucideIcon;
  label: string;
};

export const navItems: NavItem[] = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/cars', icon: Car, label: 'Cars Management' },
  { href: '/admin/anp-engine', icon: MonitorCog, label: 'ANP Engine' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col w-62.5 min-h-screen bg-primary/10 fixed left-0 px-4 py-8 items-center">
      <div className="flex gap-2 items-center">
        <span className="w-15 h-15 bg-primary rounded-md flex justify-center items-center">
          <Laptop size={24} color="white" />
        </span>
        <div className="flex-1 flex flex-col ">
          <p className="font-bold text-black text-base">ADMIN PANEL</p>
          <p className="font-normal text-black text-xs">
            Decision Support System
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col w-full mt-8 gap-4">
        {navItems.map((item) => {
          const isActive = pathname.includes(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 transition-all text-sm rounded-md ${
                isActive
                  ? 'bg-primary text-white font-semibold'
                  : 'text-black hover:pl-4 hover:border-b border-secondary'
              }`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
