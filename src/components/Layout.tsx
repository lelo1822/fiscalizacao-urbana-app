
import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  
  // Don't show sidebar on login and register pages
  const hideSidebar = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/';
  
  return (
    <div className="flex min-h-screen bg-background">
      {!hideSidebar && <Sidebar />}
      <main className={`flex-1 ${!hideSidebar ? 'md:ml-64' : ''}`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
