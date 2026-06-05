'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import LinkNav, { TLinkNav } from '../ui/LinkNav';

const navItems: TLinkNav[] = [
  { label: 'Beranda', href: '/' },
  { label: 'Catalog', href: '/catalog' },
  { label: 'Recomendations', href: '/recomendations' },
];

export default function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-secondary/10 bg-white shadow-sm">
      <nav className="flex items-center justify-between px-4 py-4 sm:px-[5%]">
        <h1 className="text-xl font-bold text-primary sm:text-2xl">AutoANP</h1>

        {/* Desktop links */}
        <div className="hidden items-center gap-4 md:flex">
          {navItems.map((item) => (
            <LinkNav key={item.href} label={item.label} href={item.href} />
          ))}
        </div>

        {/* Hamburger button — mobile only */}
        <button
          onClick={() => setIsOpen((v) => !v)}
          className="rounded-lg p-2 text-secondary transition hover:bg-slate-100 hover:text-primary md:hidden"
          aria-label="Toggle navigation"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile dropdown */}
      {isOpen && (
        <div className="border-t border-secondary/10 bg-white px-4 pb-5 md:hidden">
          <div className="flex flex-col gap-1 pt-3">
            {navItems.map((item) => (
              <div key={item.href} onClick={() => setIsOpen(false)}>
                <LinkNav label={item.label} href={item.href} />
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
