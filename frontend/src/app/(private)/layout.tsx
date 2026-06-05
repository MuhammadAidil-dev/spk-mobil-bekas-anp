import AdminSidebar from '@/components/layouts/AdminSidebar';
import AdminTopbar from '@/components/layouts/AdminTopbar';
import AuthProvider from '@/components/providers/AuthProvider';

export default function PrivateLayout({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) {
  return (
    <AuthProvider>
      <AdminSidebar />
      <div className="relative p-4 lg:ml-62.5">
        <AdminTopbar />
        <main className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">{children}</main>
      </div>
    </AuthProvider>
  );
}
