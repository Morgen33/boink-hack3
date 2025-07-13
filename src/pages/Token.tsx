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

          {/* About Section */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>About $BOINK</CardTitle>
              <CardDescription>
                The social token powering on-chain connections
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                $BOINK is the social token behind everything we're building—dating, networking, IRL events, and a little chaos in between. 
                The app's still in MVP mode, so while you'll see USD tiers, they're not live yet. We're focused on building the foundation first.
              </p>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">What $BOINK Unlocks:</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    Advanced matchmaking filters and premium features
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    Exclusive access to private IRL events and meetups
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    Profile boosts to increase your visibility
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    Voting rights on new features and platform direction
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    VIP access and holder rewards as we scale
                  </li>
                </ul>
              </div>
              
              <p className="text-muted-foreground leading-relaxed">
                We know not every $BOINK holder is single—that's why we built it for connection, not just dating. 
                Whether you're looking for love, collaborations, or just want to hang out with like-minded degens, 
                $BOINK adds flavor to every interaction.
              </p>
            </CardContent>
          </Card>

          {/* DexScreener Chart */}
          <div className="mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>$BOINK Live Chart</span>
                  <Button asChild variant="outline">
                    <a 
                      href="https://dexscreener.com/solana/8Pchwo7zWk2YSdoKZ8h7HX4GNQH8hSo8jVopJkb5sjcp" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View on DexScreener
                    </a>
                  </Button>
                </CardTitle>
                <CardDescription>
                  Real-time price and trading data for $BOINK token
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Try the iframe first, with fallback */}
                <div className="relative w-full" style={{paddingBottom: '60%', minHeight: '400px'}}>
                  <iframe 
                    src="https://dexscreener.com/solana/8Pchwo7zWk2YSdoKZ8h7HX4GNQH8hSo8jVopJkb5sjcp?embed=1&loadChartSettings=0&chartLeftToolbar=0&chartDefaultOnMobile=1&chartTheme=dark&theme=dark&chartStyle=0&chartType=usd&interval=15"
                    className="absolute top-0 left-0 w-full h-full border-0 rounded-lg"
                    title="BOINK Token Chart"
                    loading="lazy"
                    sandbox="allow-scripts allow-same-origin"
                    onLoad={() => console.log('Chart loaded')}
                    onError={() => console.error('Chart failed to load')}
                  />
                  {/* Fallback content */}
                  <div className="absolute inset-0 flex items-center justify-center bg-muted/10 rounded-lg border-2 border-dashed border-muted">
                    <div className="text-center p-8">
                      <TrendingUp className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-xl font-semibold mb-2">Chart Loading...</h3>
                      <p className="text-muted-foreground mb-4">
                        If the chart doesn't load, click the button above to view on DexScreener
                      </p>
                      <Button asChild size="sm">
                        <a 
                          href="https://dexscreener.com/solana/8Pchwo7zWk2YSdoKZ8h7HX4GNQH8hSo8jVopJkb5sjcp" 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          Open Chart
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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