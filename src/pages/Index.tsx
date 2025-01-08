import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <img
          src="/lovable-uploads/7ce98f22-edb3-447e-bced-b38cae04687d.png"
          alt="SoloSolve AI"
          className="h-32 mx-auto mb-6"
        />
        <h1 className="text-4xl font-bold text-navy mb-4">
          Welcome to SoloSolve AI
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Your AI-powered complaint management solution
        </p>
        <div className="space-y-4">
          <Button
            onClick={() => navigate("/user")}
            className="w-full bg-primary hover:bg-primary-hover text-primary-foreground"
          >
            Customer Dashboard
          </Button>
          <Button
            onClick={() => navigate("/manager")}
            className="w-full bg-primary hover:bg-primary-hover text-primary-foreground"
          >
            Manager Dashboard
          </Button>
          <Button
            onClick={() => navigate("/admin")}
            className="w-full bg-primary hover:bg-primary-hover text-primary-foreground"
          >
            Admin Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}