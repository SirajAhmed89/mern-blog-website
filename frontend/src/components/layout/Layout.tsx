import type { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useCustomCode } from '../../hooks/useCustomCode';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  // Load and inject custom code (header, footer, CSS, JS)
  useCustomCode();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}
