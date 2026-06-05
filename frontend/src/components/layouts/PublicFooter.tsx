import Link from 'next/link';

export default function PublicFooter() {
  return (
    <footer className="border-t border-t-secondary/20 bg-white px-4 py-6 sm:px-[5%] sm:py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col">
          <p className="text-xl font-semibold text-primary">AutoANP System</p>
          <p className="mt-1 text-sm font-medium text-secondary">
            &copy; Ega Pradana, {new Date().getFullYear()}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="cursor-pointer text-sm font-semibold text-secondary duration-150 hover:text-primary"
          >
            Privacy Policy
          </Link>
          <Link
            href="/"
            className="cursor-pointer text-sm font-semibold text-secondary duration-150 hover:text-primary"
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
