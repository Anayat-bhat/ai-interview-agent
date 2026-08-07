import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { InterviewProvider } from '@/context/InterviewContext';

export const metadata: Metadata = {
  title: 'AI Interview Agent | Technical Assessment Dashboard',
  description: 'AI-powered automated technical interview agent platform for candidate evaluation and feedback.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full flex flex-col bg-white text-gray-900 antialiased selection:bg-primary-light selection:text-primary">
        <InterviewProvider>
          <Navbar />
          <div className="flex-1 flex flex-col">{children}</div>
          <Footer />
        </InterviewProvider>
      </body>
    </html>
  );
}
