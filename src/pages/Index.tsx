
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background animation elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-[pulse_4s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-primary rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-[pulse_6s_ease-in-out_infinite]"></div>
      </div>

      <div className="max-w-3xl w-full text-center relative z-10">
        <img
          src="/lovable-uploads/7ce98f22-edb3-447e-bced-b38cae04687d.png"
          alt="SoloSolve AI"
          className="h-72 mx-auto mb-12 animate-fade-in hover:scale-105 transition-transform duration-300"
        />
        <h1 className="text-4xl font-bold text-navy mb-4 animate-fade-in">
          Welcome to SoloSolve AI
        </h1>
        <p className="text-lg text-navy-light mb-8 animate-fade-in">
          Your AI-powered complaint management solution
        </p>
        <div className="space-y-4 max-w-md mx-auto">
          <Button
            onClick={() => navigate("/user")}
            className="w-full bg-primary hover:bg-primary-hover text-white text-lg py-6 animate-fade-in hover:scale-105 transition-all duration-300"
          >
            Customer Dashboard
          </Button>
          <Button
            onClick={() => navigate("/manager")}
            className="w-full bg-primary hover:bg-primary-hover text-white text-lg py-6 animate-fade-in hover:scale-105 transition-all duration-300"
          >
            Manager Dashboard
          </Button>
          <Button
            onClick={() => navigate("/admin")}
            className="w-full bg-primary hover:bg-primary-hover text-white text-lg py-6 animate-fade-in hover:scale-105 transition-all duration-300"
          >
            Admin Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
