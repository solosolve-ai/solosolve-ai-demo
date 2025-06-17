
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SimulatedUser {
  id: string;
  user_id: string;
  name: string;
  email: string;
  role: string;
}

interface UserProfileProps {
  currentUser: SimulatedUser;
}

const UserProfile: React.FC<UserProfileProps> = ({ currentUser }) => {
  const navigate = useNavigate();

  // Fetch user complaint statistics from actual data
  const { data: userStats } = useQuery({
    queryKey: ['user-stats', currentUser.user_id],
    queryFn: async () => {
      const { data: complaints, error } = await supabase
        .from('transaction_history')
        .select('*')
        .eq('user_id', currentUser.user_id);
      
      if (error) throw error;

      const totalComplaints = complaints?.length || 0;
      const resolvedCount = complaints?.filter(c => c.rating_review && c.rating_review > 3).length || 0;
      const inProgressCount = complaints?.filter(c => c.rating_review && c.rating_review <= 3 && c.rating_review >= 2).length || 0;
      const newCount = complaints?.filter(c => !c.rating_review || c.rating_review < 2).length || 0;

      return {
        totalComplaints,
        resolved: resolvedCount,
        inProgress: inProgressCount,
        new: newCount
      };
    }
  });

  return (
    <div className="container mx-auto p-6">
      <button 
        onClick={() => navigate('/user/dashboard')}
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
                <AvatarFallback>
                  {currentUser.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={currentUser.name} readOnly />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={currentUser.email || 'Not provided'} readOnly />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" value="Not provided" readOnly />
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
                <p className="text-3xl font-bold">{userStats?.totalComplaints || 0}</p>
              </div>
              <div className="bg-secondary p-4 rounded-lg">
                <h3 className="text-lg font-medium">Resolved</h3>
                <p className="text-3xl font-bold">{userStats?.resolved || 0}</p>
              </div>
              <div className="bg-secondary p-4 rounded-lg">
                <h3 className="text-lg font-medium">In Progress</h3>
                <p className="text-3xl font-bold">{userStats?.inProgress || 0}</p>
              </div>
              <div className="bg-secondary p-4 rounded-lg">
                <h3 className="text-lg font-medium">New</h3>
                <p className="text-3xl font-bold">{userStats?.new || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
