import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export type breadcrumbItemsType = {
  label: string;
  href?: string;
};

type BreadcrumProps = {
  breadcrumItems: breadcrumbItemsType[];
};

export default function Breadcrumbs({ breadcrumItems }: BreadcrumProps) {
  return (
    <div className="w-full mb-8 flex items-center justify-between">
      <nav className="flex items-center gap-2 text-gray-500 text-sm">
        {breadcrumItems.map((item, index) => (
          <span key={index} className="flex items-center gap-1">
            {index > 0 && <ChevronRight size={12} className="text-gray-400" />}
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-primary transition-colors text-base"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-primary font-medium">{item.label}</span>
            )}
          </span>
        ))}
      </nav>
    </div>
  );
}
