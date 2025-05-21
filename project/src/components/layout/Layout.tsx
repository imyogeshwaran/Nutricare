import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import Navbar from './Navbar';
import Footer from './Footer';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden w-full">
        {isAuthenticated && (
          <Sidebar />
        )}
        
        <main className="flex-1 px-4 py-6 overflow-x-hidden">
          <div className="container mx-auto max-w-full px-0">
            <Outlet />
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default Layout;