
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, ShieldCheck, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { BeamsBackground } from "@/components/BeamsBackground";
import { useToast } from "@/hooks/use-toast";

interface SimulatedUser {
  id: string;
  user_id: string;
  name: string;
  email: string;
  role: string;
}

interface LoginScreenProps {
  onUserSelect: (user: SimulatedUser) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onUserSelect }) => {
  const [selectedUser, setSelectedUser] = useState<SimulatedUser | null>(null);
  const { toast } = useToast();

  const { data: users, isLoading } = useQuery({
    queryKey: ['simulated-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('simulated_users')
        .select('*')
        .order('role', { ascending: false });
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to load users",
          variant: "destructive"
        });
        throw error;
      }
      return data as SimulatedUser[];
    }
  });

  const handleUserSelect = (user: SimulatedUser) => {
    setSelectedUser(user);
  };

  const handleLogin = () => {
    if (selectedUser) {
      onUserSelect(selectedUser);
      toast({
        title: "Logged in",
        description: `Welcome ${selectedUser.name}!`,
      });
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <ShieldCheck className="h-4 w-4" />;
      case 'manager':
        return <Settings className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  if (isLoading) {
    return (
      <BeamsBackground className="flex items-center justify-center">
        <div className="text-white text-lg">Loading users...</div>
      </BeamsBackground>
    );
  }

  return (
    <BeamsBackground className="flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-white">
            SoloSolver AI - User Selection
          </CardTitle>
          <CardDescription className="text-white/80 text-lg">
            Select a user to simulate for the complaint management system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {users?.map((user) => (
              <Card
                key={user.id}
                className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                  selectedUser?.id === user.id
                    ? 'ring-2 ring-primary bg-primary/10'
                    : 'bg-white/5 backdrop-blur hover:bg-white/10'
                }`}
                onClick={() => handleUserSelect(user)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{user.name}</h3>
                      <p className="text-sm text-white/70">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge className={`${getRoleColor(user.role)} flex items-center gap-1`}>
                      {getRoleIcon(user.role)}
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                    <span className="text-xs text-white/60">{user.user_id}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center">
            <Button
              onClick={handleLogin}
              disabled={!selectedUser}
              size="lg"
              className="px-8"
            >
              Login as {selectedUser?.name || 'User'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </BeamsBackground>
  );
};
