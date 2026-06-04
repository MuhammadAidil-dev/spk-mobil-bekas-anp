'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export type TLinkNav = {
  label: string;
  href: string;
};

export default function LinkNav({ label, href }: TLinkNav) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={`font-semibold pb-2 text-base hover:text-primary duration-200 ${pathname === href ? 'text-primary border-b-2 border-primary ' : 'text-secondary'}`}
    >
      {label}
    </Link>
  );
}
