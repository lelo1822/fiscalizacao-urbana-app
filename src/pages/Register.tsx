
import RegisterCard from "@/components/auth/RegisterCard";
import { useIsMobile } from "@/hooks/use-mobile";

const Register = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className={`w-full ${isMobile ? "px-2" : "max-w-3xl"}`}>
        <RegisterCard />
      </div>
    </div>
  );
};

export default Register;
