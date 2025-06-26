
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const GMGNLink = () => {
  const { toast } = useToast();
  const contractAddress = "CdvEbor8zTsVZmQLGFHpn95YwjBairPqwDK21787bonk";
  const gmgnUrl = "https://gmgn.ai/sol/token/CdvEbor8zTsVZmQLGFHpn95YwjBairPqwDK21787bonk?4mim=5000&4im=1&4mihc=9&4ihc=1&4miv=9000&4iv=1&2mac=3&2ic=1&tab=home&code=vsb4KEHe&address=GDzyp1Ddm98Kh8CbodnqL7GSKmjKzEtXBjFhUuw1kiy9&tag=All&filter=All";

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(contractAddress);
      toast({
        title: "Copied!",
        description: "Contract address copied to clipboard",
      });
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed top-20 left-4 z-40 bg-background/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
      <div className="flex flex-col space-y-2">
        <Button
          onClick={() => window.open(gmgnUrl, '_blank')}
          className="bg-gradient-to-r from-web3-red to-web3-magenta hover:opacity-90 text-white text-sm"
          size="sm"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          View on GMGN
        </Button>
        
        <div className="flex items-center space-x-2 bg-muted rounded-md p-2">
          <code className="text-xs font-mono truncate max-w-[200px]">
            {contractAddress}
          </code>
          <Button
            onClick={copyToClipboard}
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
          >
            <Copy className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GMGNLink;
