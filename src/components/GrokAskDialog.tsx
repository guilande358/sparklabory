import { useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useGrok } from "@/hooks/useGrok";
import { ScrollArea } from "@/components/ui/scroll-area";

interface GrokAskDialogProps {
  projectContext: string;
}

const GrokAskDialog = ({ projectContext }: GrokAskDialogProps) => {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [conversation, setConversation] = useState<Array<{role: string, content: string}>>([]);
  const [asking, setAsking] = useState(false);
  const { toast } = useToast();
  const { askGrok } = useGrok();

  const handleAsk = async () => {
    if (!question.trim()) return;

    const userQuestion = question;
    setQuestion("");
    setConversation(prev => [...prev, { role: "user", content: userQuestion }]);
    setAsking(true);

    try {
      const answer = await askGrok(userQuestion, projectContext);
      
      if (answer) {
        setConversation(prev => [...prev, { role: "assistant", content: answer }]);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to get response from Grok",
        variant: "destructive",
      });
    } finally {
      setAsking(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <MessageSquare className="w-4 h-4 mr-2" />
          Ask Grok
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Ask Grok AI</DialogTitle>
          <DialogDescription>
            Get scientific explanations and citations for your project questions
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 h-full">
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {conversation.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  Ask Grok anything about your project!
                </div>
              )}
              {conversation.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg ${
                    msg.role === "user"
                      ? "bg-primary/10 ml-8"
                      : "bg-secondary mr-8"
                  }`}
                >
                  <p className="text-sm font-semibold mb-1">
                    {msg.role === "user" ? "You" : "Grok AI"}
                  </p>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              ))}
              {asking && (
                <div className="bg-secondary mr-8 p-3 rounded-lg">
                  <p className="text-sm font-semibold mb-1">Grok AI</p>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="space-y-2">
            <Label htmlFor="question">Your Question</Label>
            <div className="flex gap-2">
              <Textarea
                id="question"
                placeholder="What would you like to know about your project?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleAsk();
                  }
                }}
                rows={3}
              />
              <Button onClick={handleAsk} disabled={asking || !question.trim()} size="icon">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GrokAskDialog;
