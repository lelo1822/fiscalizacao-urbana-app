
import LoginCard from "@/components/auth/LoginCard";

const Login = () => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: "url('/lovable-uploads/8c6f01a1-4697-4d7f-a8b2-b609826838bb.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <div className="w-full max-w-md">
        <LoginCard />
      </div>
    </div>
  );
};

export default Login;
