import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center mb-8">
        <img
          src="/lovable-uploads/7ce98f22-edb3-447e-bced-b38cae04687d.png"
          alt="SoloSolve AI"
          className="h-12 mx-auto mb-6"
        />
        <h1 className="text-4xl font-bold text-navy mb-4">
          Welcome to SoloSolve AI
        </h1>
        <p className="text-gray-600 max-w-md mx-auto">
          Select your role to access the complaint management system
        </p>
      </div>
      
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Button
          onClick={() => navigate("/user")}
          className="w-full py-6 text-lg"
          variant="default"
        >
          Customer Portal
        </Button>
        <Button
          onClick={() => navigate("/admin")}
          className="w-full py-6 text-lg"
          variant="outline"
        >
          Admin Dashboard
        </Button>
        <Button
          onClick={() => navigate("/manager")}
          className="w-full py-6 text-lg"
          variant="outline"
        >
          Manager Dashboard
        </Button>
      </div>
    </div>
  );
};

export default Index;