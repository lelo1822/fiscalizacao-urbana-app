
import { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  User,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  // Função para obter as iniciais do nome do usuário
  const getUserInitials = () => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const MenuItem = ({
    to,
    icon,
    label,
  }: {
    to: string;
    icon: React.ReactNode;
    label: string;
  }) => {
    const isActive = location.pathname === to;

    return (
      <Link
        to={to}
        className={`flex items-center space-x-3 p-2 rounded-md transition-colors ${
          isActive
            ? "bg-primary text-white"
            : "hover:bg-primary/10 text-gray-800"
        }`}
      >
        {icon}
        {!collapsed && <span>{label}</span>}
      </Link>
    );
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      className={`border-r flex flex-col ${
        collapsed ? "w-16" : "w-64"
      } transition-all duration-300 h-screen sticky top-0 bg-white shrink-0`}
    >
      <div className="flex justify-between items-center p-4 border-b">
        {!collapsed && (
          <div>
            <h1 className="text-lg font-bold text-primary">Câmara na Rua</h1>
          </div>
        )}
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="rounded-full p-1 hover:bg-gray-100"
        >
          <ChevronLeft
            className={`h-5 w-5 transition-transform ${
              collapsed ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      <div className="flex flex-col flex-1 overflow-y-auto py-6 px-2 space-y-2">
        <MenuItem to="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
        <MenuItem to="/reports" icon={<FileText size={20} />} label="Ocorrências" />
        <MenuItem to="/profile" icon={<User size={20} />} label="Perfil" />
        <MenuItem to="/settings" icon={<Settings size={20} />} label="Configurações" />
      </div>

      <div className="border-t p-4">
        <div className="flex items-center mb-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.photoURL || undefined} />
            <AvatarFallback className="bg-primary text-white">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                Gabinete {user?.gabineteId || "Admin"}
              </p>
            </div>
          )}
        </div>
        <Button
          variant="outline"
          className={`border-gray-300 ${collapsed ? "p-2 w-full" : ""}`}
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Sair</span>}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
