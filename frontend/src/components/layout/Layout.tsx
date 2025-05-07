import { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-6 flex">
        <Sidebar />
        <main className="flex-1 ml-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
