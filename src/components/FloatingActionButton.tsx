
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Camera, 
  Menu, 
  X, 
  User,
  Settings,
  BarChart3,
  FileText,
  Home 
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface FloatingActionButtonProps {
  className?: string;
}

const FloatingActionButton = ({ className }: FloatingActionButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navigateTo = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const actions = [
    { label: "Nova Ocorrência", icon: Camera, path: "/report/new", color: "bg-primary hover:bg-primary/90 text-white" },
    // Removed Map button as requested
    { label: "Dashboard", icon: BarChart3, path: "/dashboard", color: "bg-[#8a4baf] hover:bg-[#7a3b9f] text-white" },
    { label: "Ocorrências", icon: FileText, path: "/reports", color: "bg-[#6a11cb] hover:bg-[#5a01bb] text-white" },
    { label: "Perfil", icon: User, path: "/profile", color: "bg-[#9c6bbc] hover:bg-[#8c5bac] text-white" },
    { label: "Configurações", icon: Settings, path: "/settings", color: "bg-[#a66ad7] hover:bg-[#965ac7] text-white" },
  ];

  // Não mostrar o FAB na página inicial ou em telas não mobile
  if (location.pathname === "/" || window.innerWidth > 768) {
    return null;
  }

  return (
    <div className={cn("fixed bottom-6 right-4 z-40", className)}>
      {/* Menu Items */}
      <div 
        className={cn(
          "flex flex-col-reverse items-end gap-2 mb-3 transition-all duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        {actions.map((action) => (
          <div 
            key={action.path}
            className={cn(
              "transform transition-all duration-300",
              isOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            )}
          >
            <Button
              size="icon"
              className={cn(
                "w-12 h-12 rounded-full shadow-md flex items-center justify-center",
                action.color
              )}
              onClick={() => navigateTo(action.path)}
            >
              <action.icon className="h-5 w-5" />
              <span className="sr-only">{action.label}</span>
            </Button>
            {isOpen && (
              <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-80">
                {action.label}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Main Button */}
      <Button
        size="icon"
        className={cn(
          "w-14 h-14 rounded-full shadow-lg transition-all duration-300 transform",
          isOpen ? "bg-gray-800 rotate-45" : "bg-primary"
        )}
        onClick={toggleMenu}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>
    </div>
  );
};

export default FloatingActionButton;
