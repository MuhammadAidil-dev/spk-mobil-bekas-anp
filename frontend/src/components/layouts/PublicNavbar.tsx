import LinkNav, { TLinkNav } from '../ui/LinkNav';

const navItems: TLinkNav[] = [
  {
    label: 'Beranda',
    href: '/',
  },
  {
    label: 'Catalog',
    href: '/catalog',
  },
  {
    label: 'Recomendations',
    href: '/recomendations',
  },
];

export default function PublicNavbar() {
  return (
    <header className="fixed top-0 inset-x-0 py-8 px-[5%] bg-white border border-secondary/10 shadow-sm z-50">
      <nav className="flex items-center justify-between">
        <h1 className="font-bold text-2xl text-primary">AutoANP</h1>
        <div className="flex items-center gap-4">
          {navItems.map((item, index) => {
            return <LinkNav key={index} label={item.label} href={item.href} />;
          })}
        </div>
      </nav>
    </header>
  );
}
