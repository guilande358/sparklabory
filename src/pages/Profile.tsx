import { Settings, LogOut, Bell, Shield, HelpCircle, Mail } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";

const Profile = () => {
  const menuItems = [
    { icon: Settings, label: "Account Settings", description: "Manage your account" },
    { icon: Bell, label: "Notifications", description: "Configure alerts" },
    { icon: Shield, label: "Privacy", description: "Control your data" },
    { icon: Mail, label: "Contact Support", description: "Get help" },
    { icon: HelpCircle, label: "Help Center", description: "Learn more" },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg border-b border-border/50 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Profile
          </h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Profile Header */}
        <Card className="p-6 text-center space-y-4">
          <Avatar className="w-24 h-24 mx-auto border-4 border-primary/20">
            <AvatarFallback className="bg-gradient-primary text-primary-foreground text-2xl font-bold">
              JD
            </AvatarFallback>
          </Avatar>
          
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-card-foreground">John Doe</h2>
            <Badge className="bg-primary/20 text-primary-foreground border-primary/30">
              Student
            </Badge>
            <p className="text-sm text-muted-foreground">
              john.doe@school.edu
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
            <div>
              <p className="text-2xl font-bold text-primary">12</p>
              <p className="text-xs text-muted-foreground">Projects</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary">28</p>
              <p className="text-xs text-muted-foreground">Experiments</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent">2.4K</p>
              <p className="text-xs text-muted-foreground">Points</p>
            </div>
          </div>
        </Card>

        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card 
                key={index}
                className="p-4 hover:shadow-md transition-all cursor-pointer animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-gradient-primary/20">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm text-card-foreground">{item.label}</h3>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Logout Button */}
        <Button variant="destructive" className="w-full" size="lg">
          <LogOut className="w-5 h-5 mr-2" />
          Sign Out
        </Button>
      </main>

      <Navigation />
    </div>
  );
};

export default Profile;
