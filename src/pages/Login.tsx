
import LoginCard from "@/components/auth/LoginCard";
import { useIsMobile } from "@/hooks/use-mobile";

const Login = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6">
      <div className={`w-full ${isMobile ? "" : "max-w-md"}`}>
        <LoginCard />
      </div>
    </div>
  );
};

export default Login;
