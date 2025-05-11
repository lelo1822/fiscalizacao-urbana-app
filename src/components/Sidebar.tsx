
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  BarChart3, 
  FileText, 
  User, 
  Camera,
  LogOut,
  Menu,
  X,
  Settings
} from "lucide-react";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      name: "Mapa",
      path: "/map",
      icon: <MapPin className="h-5 w-5" />,
    },
    {
      name: "Nova Ocorrência",
      path: "/report/new",
      icon: <Camera className="h-5 w-5" />,
    },
    {
      name: "Histórico de Rotas",
      path: "/routes",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: "Perfil",
      path: "/profile",
      icon: <User className="h-5 w-5" />,
    },
    {
      name: "Configurações",
      path: "/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button 
          variant="outline" 
          size="icon"
          className="bg-white shadow-md"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>
      
      {/* Mobile Sidebar */}
      <div className={cn(
        "fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity",
        isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
        <div className={cn(
          "fixed top-0 left-0 h-full w-64 bg-white shadow-lg transition-transform transform",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-primary">CidadeMon</h2>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={toggleMobileMenu}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            {renderSidebarContent()}
          </div>
        </div>
      </div>
      
      {/* Desktop Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 h-full bg-white shadow-lg transition-all duration-300 ease-in-out hidden md:block",
        isCollapsed ? "w-16" : "w-64"
      )}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            {!isCollapsed && (
              <h2 className="text-xl font-bold text-primary">CidadeMon</h2>
            )}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleSidebar}
              className={isCollapsed ? "mx-auto" : ""}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          {renderSidebarContent()}
        </div>
      </aside>
    </>
  );

  function renderSidebarContent() {
    return (
      <>
        {/* User Info */}
        <div className="mb-8">
          {!isCollapsed && (
            <>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                  {user?.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.role === 'admin' ? 'Administrador' : 'Agente'}</p>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Navigation Links */}
        <nav>
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink 
                  to={item.path}
                  className={({ isActive }) => cn(
                    "flex items-center py-2 px-3 rounded-lg transition-colors",
                    isActive 
                      ? "bg-primary text-white" 
                      : "text-gray-700 hover:bg-gray-100",
                    isCollapsed ? "justify-center" : ""
                  )}
                >
                  {item.icon}
                  {!isCollapsed && <span className="ml-3">{item.name}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Logout Button */}
        <div className="absolute bottom-4 left-0 right-0 px-4">
          <Button 
            variant="ghost" 
            className={cn(
              "text-gray-700 hover:bg-gray-100 w-full flex items-center",
              isCollapsed ? "justify-center" : ""
            )}
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span className="ml-3">Sair</span>}
          </Button>
        </div>
      </>
    );
  }
};

export default Sidebar;
