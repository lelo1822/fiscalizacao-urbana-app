
import RegisterCard from "@/components/auth/RegisterCard";

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/10 to-secondary/20 p-4">
      <div className="w-full max-w-2xl"> {/* Increased max-width to accommodate the photo grid */}
        <RegisterCard />
      </div>
    </div>
  );
};

export default Register;
