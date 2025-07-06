import { ExternalLink, Lock, Calendar, TrendingUp, Shield, Users, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Token = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-foreground mb-2">$BOINK Token</h1>
              <p className="text-xl text-muted-foreground">Fueling the chaos of on-chain dating</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge variant="secondary" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Audit: Safe (4/4)
              </Badge>
              <Badge variant="outline" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                24h: +41.18%
              </Badge>
              <Badge variant="outline" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                22.5M Locked
              </Badge>
            </div>

            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              $BOINK fuels the chaos—boost your profile, flex for matches, and help steer the wild ride that is on-chain dating.
            </p>
          </div>

          {/* DexScreener Chart */}
          <div className="mb-12">
            <style dangerouslySetInnerHTML={{
              __html: `
                #dexscreener-embed {
                  position: relative;
                  width: 100%;
                  padding-bottom: 125%;
                }
                @media(min-width: 1400px) {
                  #dexscreener-embed {
                    padding-bottom: 65%;
                  }
                }
                #dexscreener-embed iframe {
                  position: absolute;
                  width: 100%;
                  height: 100%;
                  top: 0;
                  left: 0;
                  border: 0;
                  border-radius: 8px;
                }
              `
            }} />
            <div id="dexscreener-embed">
              <iframe 
                src="https://dexscreener.com/solana/8Pchwo7zWk2YSdoKZ8h7HX4GNQH8hSo8jVopJkb5sjcp?embed=1&loadChartSettings=0&chartLeftToolbar=0&chartTheme=dark&theme=dark&chartStyle=0&chartType=usd&interval=15"
                title="BOINK Token Chart"
              />
            </div>
          </div>

          {/* Token Details */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Locked Supply */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Locked Supply
                </CardTitle>
                <CardDescription>
                  Tokens secured via Streamflow until unlock date
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Locked Amount:</span>
                  <span className="font-semibold">22,508,900 BOINK</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Lock Value:</span>
                  <span className="font-semibold">$562.30</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Unlock Date:</span>
                  <span className="font-semibold flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    July 30, 2025
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="secondary">Immutable Contract</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Token Information */}
            <Card>
              <CardHeader>
                <CardTitle>Token Information</CardTitle>
                <CardDescription>
                  Key details about $BOINK token
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Contract Address:</span>
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    CdvE...bonk
                  </code>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Created:</span>
                  <span className="font-semibold">June 25, 2025</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Trade Fees:</span>
                  <span className="font-semibold">1.25%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Top 10 Holdings:</span>
                  <span className="font-semibold">28.8%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Developer:</span>
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    44oK...pu4X
                  </code>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Links Section */}
          <Card>
            <CardHeader>
              <CardTitle>Official Links</CardTitle>
              <CardDescription>
                Access official resources and trading platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="outline" asChild className="h-auto p-4">
                  <a 
                    href="https://boinkme.xyz/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2"
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span>Official Website</span>
                  </a>
                </Button>

                <Button variant="outline" asChild className="h-auto p-4">
                  <a 
                    href="https://x.com/BoinkOnBonk" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2"
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span>Twitter/X</span>
                  </a>
                </Button>

                <Button variant="outline" asChild className="h-auto p-4">
                  <a 
                    href="https://gmgn.ai/sol/token/CdvEbor8zTsVZmQLGFHpn95YwjBairPqwDK21787bonk" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2"
                  >
                    <TrendingUp className="w-5 h-5" />
                    <span>GMGN Trading</span>
                  </a>
                </Button>

                <Button variant="outline" asChild className="h-auto p-4">
                  <a 
                    href="https://app.streamflow.finance/contract/solana/mainnet/63gvea21xJE4ry8Ji4QdVxEMzXbYXPWoFqKmHCTxMWx7" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2"
                  >
                    <Lock className="w-5 h-5" />
                    <span>Streamflow Lock</span>
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <div className="mt-12 p-6 bg-muted rounded-lg">
            <h3 className="text-lg font-semibold mb-2">⚠️ Important Disclaimer</h3>
            <p className="text-sm text-muted-foreground">
              This information is provided for educational purposes only and should not be considered financial advice. 
              Cryptocurrency investments are highly volatile and risky. Always do your own research and never invest 
              more than you can afford to lose. Token prices and data are subject to change rapidly.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Token;