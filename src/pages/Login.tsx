
import LoginCard from "@/components/auth/LoginCard";
import { useIsMobile } from "@/hooks/use-mobile";

const Login = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex items-center justify-center px-3 py-4">
      <div className={`w-full ${isMobile ? "" : "max-w-md"}`}>
        <LoginCard />
      </div>
    </div>
  );
};

export default Login;
