import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient?: "primary" | "secondary" | "accent";
  onClick?: () => void;
}

const FeatureCard = ({ icon: Icon, title, description, gradient = "primary", onClick }: FeatureCardProps) => {
  const gradientClasses = {
    primary: "from-primary/20 to-primary-glow/20 hover:from-primary/30 hover:to-primary-glow/30",
    secondary: "from-secondary/20 to-secondary/30 hover:from-secondary/30 hover:to-secondary/40",
    accent: "from-accent/20 to-accent/30 hover:from-accent/30 hover:to-accent/40",
  };

  return (
    <Card
      onClick={onClick}
      className={cn(
        "p-6 cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-105 bg-gradient-to-br border-0",
        gradientClasses[gradient]
      )}
    >
      <div className="flex flex-col items-start gap-3">
        <div className="p-3 rounded-xl bg-card/50 backdrop-blur-sm">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-lg font-bold text-card-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </Card>
  );
};

export default FeatureCard;
