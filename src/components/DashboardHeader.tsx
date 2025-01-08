import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DashboardHeader = () => {
  const navigate = useNavigate();
  
  return (
    <header className="mb-8">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate('/')}
          className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          aria-label="Back to main screen"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <img
          src="/lovable-uploads/7ce98f22-edb3-447e-bced-b38cae04687d.png"
          alt="SoloSolve AI"
          className="h-32"
        />
      </div>
      <h1 className="text-3xl font-bold text-navy">My Complaints</h1>
      <p className="text-gray-600 mt-2">Track and manage your complaints</p>
    </header>
  );
};

export default DashboardHeader;