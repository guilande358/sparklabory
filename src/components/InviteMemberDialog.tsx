import { useState } from "react";
import { UserPlus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface InviteMemberDialogProps {
  projectId: string;
  onMemberAdded: () => void;
}

const InviteMemberDialog = ({ projectId, onMemberAdded }: InviteMemberDialogProps) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [searching, setSearching] = useState(false);
  const [foundUser, setFoundUser] = useState<any>(null);
  const [inviting, setInviting] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!email) return;

    setSearching(true);
    try {
      // Search for profile - assuming email will be added to profiles table
      // For now, we'll use a simple approach where users enter user ID
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .ilike("full_name", `%${email}%`)
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        toast({
          title: "User not found",
          description: "No user found with this name or email",
          variant: "destructive",
        });
        setFoundUser(null);
        return;
      }

      setFoundUser(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Unable to search users. Please try again.",
        variant: "destructive",
      });
      setFoundUser(null);
    } finally {
      setSearching(false);
    }
  };

  const handleInvite = async () => {
    if (!foundUser) return;

    setInviting(true);
    try {
      const { error } = await supabase.from("project_members").insert({
        project_id: projectId,
        user_id: foundUser.id,
        role: "member",
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `${foundUser.full_name} has been added to the project`,
      });

      setOpen(false);
      setEmail("");
      setFoundUser(null);
      onMemberAdded();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setInviting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>
            Search for a user by email and add them to your project
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Search User</Label>
            <div className="flex gap-2">
              <Input
                id="email"
                type="text"
                placeholder="Enter user name"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch} disabled={searching} size="icon">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {foundUser && (
            <div className="p-4 rounded-lg bg-secondary/50 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-lg font-semibold">
                  {foundUser.full_name?.[0] || "U"}
                </div>
                <div>
                  <p className="font-medium">{foundUser.full_name || "Unknown User"}</p>
                  <p className="text-sm text-muted-foreground">{foundUser.institution || "No institution"}</p>
                </div>
              </div>
              <Button onClick={handleInvite} disabled={inviting} className="w-full">
                {inviting ? "Inviting..." : "Add to Project"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteMemberDialog;
