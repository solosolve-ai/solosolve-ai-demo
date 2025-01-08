import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6">
      <button 
        onClick={() => navigate('/user')}
        className="mb-6 p-2 rounded-full hover:bg-gray-200 transition-colors inline-flex items-center gap-2"
        aria-label="Back to dashboard"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Dashboard</span>
      </button>

      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4 mb-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder.svg" alt="Profile picture" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value="John Doe" readOnly />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value="john.doe@example.com" readOnly />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" value="+1 (555) 123-4567" readOnly />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary p-4 rounded-lg">
                <h3 className="text-lg font-medium">Total Complaints</h3>
                <p className="text-3xl font-bold">12</p>
              </div>
              <div className="bg-secondary p-4 rounded-lg">
                <h3 className="text-lg font-medium">Resolved</h3>
                <p className="text-3xl font-bold">8</p>
              </div>
              <div className="bg-secondary p-4 rounded-lg">
                <h3 className="text-lg font-medium">In Progress</h3>
                <p className="text-3xl font-bold">3</p>
              </div>
              <div className="bg-secondary p-4 rounded-lg">
                <h3 className="text-lg font-medium">New</h3>
                <p className="text-3xl font-bold">1</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default UserProfile;