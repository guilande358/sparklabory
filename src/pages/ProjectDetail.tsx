import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Users, MessageSquare, Lightbulb, FileText, Download, Beaker } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useGrok } from "@/hooks/useGrok";
import Navigation from "@/components/Navigation";
import InviteMemberDialog from "@/components/InviteMemberDialog";
import GrokAskDialog from "@/components/GrokAskDialog";
import { generateProjectPDF } from "@/lib/pdfGenerator";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { generateHypothesis, generateReport } = useGrok();
  
  const [project, setProject] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hypothesis, setHypothesis] = useState("");
  const [methodology, setMethodology] = useState("");
  const [results, setResults] = useState("");

  useEffect(() => {
    if (id) {
      loadProject();
      loadMembers();
    }
  }, [id]);

  const loadProject = async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      
      setProject(data);
      setTitle(data.title);
      setDescription(data.description || "");
      setHypothesis(data.hypothesis || "");
      setMethodology(data.methodology || "");
      setResults(data.results || "");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMembers = async () => {
    if (!id) return;
    
    try {
      const { data, error } = await supabase
        .from("project_members")
        .select("*, profiles(*)")
        .eq("project_id", id);

      if (error) throw error;
      setMembers(data || []);
    } catch (error: any) {
      console.error("Error loading members:", error);
    }
  };

  const handleSave = async () => {
    if (!project) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from("projects")
        .update({
          title,
          description,
          hypothesis,
          methodology,
          results,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Project updated successfully",
      });
      loadProject();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateHypotheses = async () => {
    setGenerating(true);
    try {
      const hypotheses = await generateHypothesis(title, project.category, description);
      if (hypotheses) {
        setHypothesis(hypotheses.join("\n\n"));
        toast({
          title: "Hypotheses Generated",
          description: "Grok has suggested hypotheses for your project",
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  const handleGeneratePDF = async () => {
    if (!project) return;
    
    try {
      const report = await generateReport({
        ...project,
        title,
        description,
        hypothesis,
        methodology,
        results,
      });
      
      if (report) {
        generateProjectPDF({
          ...project,
          title,
          description,
          hypothesis,
          methodology,
          results,
          report,
        });
        
        toast({
          title: "Report Generated",
          description: "Your project report has been downloaded",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkComplete = async () => {
    try {
      const { error } = await supabase
        .from("projects")
        .update({ status: "completed" })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Project Completed",
        description: "Project marked as completed",
      });
      loadProject();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <p className="text-muted-foreground">Project not found</p>
      </div>
    );
  }

  const isEditable = project.status !== "completed";

  return (
    <div className="min-h-screen bg-gradient-hero pb-24">
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/projects")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{project.title}</h1>
            <Badge variant={project.status === "completed" ? "default" : "secondary"}>
              {project.status}
            </Badge>
          </div>
          <InviteMemberDialog projectId={id!} onMemberAdded={loadMembers} />
          <GrokAskDialog projectContext={`${title}\n${description}`} />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Project Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Project Details</span>
              {isEditable && (
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={!isEditable}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={!isEditable}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Hypothesis Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Hypothesis</span>
              {isEditable && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateHypotheses}
                  disabled={generating}
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  {generating ? "Generating..." : "Generate with Grok"}
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={hypothesis}
              onChange={(e) => setHypothesis(e.target.value)}
              disabled={!isEditable}
              rows={6}
              placeholder="Enter your hypothesis or generate one with Grok AI..."
            />
          </CardContent>
        </Card>

        {/* Methodology Card */}
        <Card>
          <CardHeader>
            <CardTitle>Methodology</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={methodology}
              onChange={(e) => setMethodology(e.target.value)}
              disabled={!isEditable}
              rows={6}
              placeholder="Describe your research methodology..."
            />
          </CardContent>
        </Card>

        {/* Results Card */}
        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={results}
              onChange={(e) => setResults(e.target.value)}
              disabled={!isEditable}
              rows={6}
              placeholder="Document your results..."
            />
          </CardContent>
        </Card>

        {/* Members Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Team Members ({members.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {members.map((member) => (
                <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg bg-secondary/50">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    {member.profiles?.full_name?.[0] || "U"}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{member.profiles?.full_name || "Unknown User"}</p>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3 flex-wrap">
          <Button 
            onClick={() => navigate(`/lab?project=${id}`)} 
            variant="secondary"
            className="flex-1 min-w-[200px]"
          >
            <Beaker className="w-4 h-4 mr-2" />
            Open in Virtual Lab
          </Button>
          
          {isEditable && (
            <Button onClick={handleMarkComplete} className="flex-1 min-w-[200px]">
              <FileText className="w-4 h-4 mr-2" />
              Mark as Completed
            </Button>
          )}
          {project.status === "completed" && (
            <Button onClick={handleGeneratePDF} variant="outline" className="flex-1 min-w-[200px]">
              <Download className="w-4 h-4 mr-2" />
              Generate PDF Report
            </Button>
          )}
        </div>
      </main>

      <Navigation />
    </div>
  );
};

export default ProjectDetail;
