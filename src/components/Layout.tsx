
import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import { useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Don't show sidebar on login and register pages
  const hideSidebar = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/';
  
  return (
    <div className="flex min-h-screen">
      {!hideSidebar && <Sidebar />}
      <main className={`flex-1 ${isMobile ? "p-2" : "p-4"}`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
