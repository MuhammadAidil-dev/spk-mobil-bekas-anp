import PublicFooter from '@/components/layouts/PublicFooter';
import PublicNavbar from '@/components/layouts/PublicNavbar';

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <PublicNavbar />
      <main className="flex flex-col mt-24 px-[5%]">{children}</main>
      <PublicFooter />
    </>
  );
}
