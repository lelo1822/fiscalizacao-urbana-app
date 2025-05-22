import RegisterCard from "@/components/auth/RegisterCard";

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-3xl"> {/* Keeping the increased max-width for the registration form */}
        <RegisterCard />
      </div>
    </div>
  );
};

export default Register;
