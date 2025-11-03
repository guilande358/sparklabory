import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plug, ExternalLink } from "lucide-react";

interface ExternalSimulatorConfigProps {
  onConnect: (config: ExternalSimulatorConfig) => void;
}

interface ExternalSimulatorConfig {
  type: "api" | "iframe" | "websocket";
  url: string;
  apiKey?: string;
  headers?: Record<string, string>;
}

const ExternalSimulatorConfig = ({ onConnect }: ExternalSimulatorConfigProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"api" | "iframe" | "websocket">("api");
  const [url, setUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [customHeaders, setCustomHeaders] = useState("");

  const handleConnect = () => {
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a URL",
        variant: "destructive",
      });
      return;
    }

    let headers: Record<string, string> = {};
    if (customHeaders) {
      try {
        headers = JSON.parse(customHeaders);
      } catch (e) {
        toast({
          title: "Error",
          description: "Invalid JSON format for headers",
          variant: "destructive",
        });
        return;
      }
    }

    if (apiKey) {
      headers["Authorization"] = `Bearer ${apiKey}`;
    }

    onConnect({
      type,
      url,
      apiKey,
      headers: Object.keys(headers).length > 0 ? headers : undefined,
    });

    toast({
      title: "Connected",
      description: "External simulator connected successfully",
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plug className="w-4 h-4 mr-2" />
          Connect External Simulator
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Connect External Simulator</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label>Connection Type</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <Button
                variant={type === "api" ? "default" : "outline"}
                size="sm"
                onClick={() => setType("api")}
              >
                API
              </Button>
              <Button
                variant={type === "iframe" ? "default" : "outline"}
                size="sm"
                onClick={() => setType("iframe")}
              >
                iFrame
              </Button>
              <Button
                variant={type === "websocket" ? "default" : "outline"}
                size="sm"
                onClick={() => setType("websocket")}
              >
                WebSocket
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="url">Simulator URL *</Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={
                type === "api" 
                  ? "https://api.simulator.com/v1" 
                  : type === "websocket"
                  ? "wss://simulator.com/socket"
                  : "https://simulator.com/embed"
              }
            />
          </div>

          {type === "api" && (
            <>
              <div>
                <Label htmlFor="apiKey">API Key (optional)</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key"
                />
              </div>

              <div>
                <Label htmlFor="headers">Custom Headers (JSON, optional)</Label>
                <Textarea
                  id="headers"
                  value={customHeaders}
                  onChange={(e) => setCustomHeaders(e.target.value)}
                  placeholder='{"Content-Type": "application/json"}'
                  rows={3}
                />
              </div>
            </>
          )}

          <div className="flex gap-2">
            <Button onClick={handleConnect} className="flex-1">
              <ExternalLink className="w-4 h-4 mr-2" />
              Connect
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExternalSimulatorConfig;
