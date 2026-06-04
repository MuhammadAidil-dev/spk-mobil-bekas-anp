import AdminSidebar from '@/components/layouts/AdminSidebar';
import AdminTopbar from '@/components/layouts/AdminTopbar';

export default function PrivateLayout({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) {
  return (
    <>
      <AdminSidebar />
      <div className="ml-62.5 p-4 relative">
        <AdminTopbar />
        <main className="py-24 px-[5%]">{children}</main>
      </div>
    </>
  );
}
