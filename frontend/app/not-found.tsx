import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-6xl font-extrabold text-primary mb-2">404</h1>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
      <p className="text-sm text-gray-500 max-w-md mb-6">
        The interview session or page you are looking for does not exist or has expired.
      </p>
      <Link href="/">
        <Button variant="primary" icon={<Home className="w-4 h-4" />}>
          Return to Home
        </Button>
      </Link>
    </div>
  );
}
