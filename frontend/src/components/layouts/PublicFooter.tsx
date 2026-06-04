import Link from 'next/link';

export default function PublicFooter() {
  return (
    <footer className="bg-white border-t border-t-secondary/20 flex justify-between items-center px-[5%] py-8">
      <div className="flex flex-col">
        <p className="font-semibold text-xl text-primary">AutoANP System</p>
        <p className="font-medium text-sm text-secondary mt-2">
          &copy; Ega Pradana, {new Date().getFullYear()}{' '}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="font-semibold text-sm text-secondary cursor-pointer hover:text-primary duration-150"
        >
          Privacy Policy
        </Link>
        <Link
          href="/"
          className="font-semibold text-sm text-secondary cursor-pointer hover:text-primary duration-150"
        >
          Terms of Service
        </Link>
      </div>
    </footer>
  );
}
