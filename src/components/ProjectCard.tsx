import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  title: string;
  description: string;
  status: "planning" | "ongoing" | "completed";
  members: number;
  deadline: string;
  category: string;
}

const ProjectCard = ({ title, description, status, members, deadline, category }: ProjectCardProps) => {
  const statusColors = {
    planning: "bg-accent/20 text-accent-foreground border-accent/30",
    ongoing: "bg-primary/20 text-primary-foreground border-primary/30",
    completed: "bg-secondary/20 text-secondary-foreground border-secondary/30",
  };

  const statusLabels = {
    planning: "Planning",
    ongoing: "Ongoing",
    completed: "Completed",
  };

  return (
    <Card className="p-5 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer border border-border/50">
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-bold text-card-foreground line-clamp-1">{title}</h3>
          <Badge className={cn("text-xs border", statusColors[status])}>
            {statusLabels[status]}
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="outline" className="font-normal">
            {category}
          </Badge>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{members} members</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{deadline}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProjectCard;
