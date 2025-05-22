
import LoginCard from "@/components/auth/LoginCard";
import { useIsMobile } from "@/hooks/use-mobile";

const Login = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className={`w-full ${isMobile ? "px-2" : "max-w-md"}`}>
        <LoginCard />
      </div>
    </div>
  );
};

export default Login;
