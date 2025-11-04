import { useState } from "react";
import { MessageSquare, X, Send, Minimize2, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGrok } from "@/hooks/useGrok";
import { useToast } from "@/hooks/use-toast";

interface FloatingAssistantProps {
  context?: string;
}

const FloatingAssistant = ({ context }: FloatingAssistantProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
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
      const answer = await askGrok(userQuestion, context);
      
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

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        size="lg"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:scale-110 transition-transform z-50"
      >
        <MessageSquare className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <Card 
      className={`fixed bottom-6 right-6 shadow-xl z-50 transition-all duration-300 ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          <h3 className="font-bold">xAI Assistant</h3>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <div className="flex flex-col h-[calc(100%-4rem)]">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {conversation.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <p className="text-sm">👋 Olá! Sou o assistente xAI.</p>
                  <p className="text-xs mt-2">Como posso ajudá-lo hoje?</p>
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
                  <p className="text-xs font-semibold mb-1 text-muted-foreground">
                    {msg.role === "user" ? "Você" : "xAI Assistant"}
                  </p>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              ))}
              {asking && (
                <div className="bg-secondary mr-8 p-3 rounded-lg">
                  <p className="text-xs font-semibold mb-1 text-muted-foreground">xAI Assistant</p>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Textarea
                placeholder="Digite sua pergunta..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleAsk();
                  }
                }}
                rows={2}
                className="resize-none"
              />
              <Button 
                onClick={handleAsk} 
                disabled={asking || !question.trim()} 
                size="icon"
                className="shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default FloatingAssistant;
