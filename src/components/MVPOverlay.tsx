
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Users, Wallet, Calendar, User, Twitter, Music, Instagram, Facebook } from 'lucide-react';

interface MVPOverlayProps {
  onEnter: () => void;
}

const MVPOverlay = ({ onEnter }: MVPOverlayProps) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full bg-white/95 backdrop-blur-sm border-2 border-web3-orange shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-web3-yellow to-web3-orange rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-gray-800" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-web3-red to-web3-magenta bg-clip-text text-transparent">
            Welcome to BOINK!
          </CardTitle>
          <p className="text-lg text-gray-600 mt-2">
            We are now fully functioning and in beta testing
          </p>
          <p className="text-sm text-gray-500">
            Where Degens Find Their People
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-gradient-to-r from-web3-yellow/10 to-web3-orange/10 p-4 rounded-lg border border-web3-orange/20">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-web3-red" />
              What's New:
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <Twitter className="w-4 h-4 mr-3 text-web3-red" />
                Twitter X integration
              </li>
              <li className="flex items-center">
                <Music className="w-4 h-4 mr-3 text-web3-red" />
                Spotify integration
              </li>
              <li className="flex items-center">
                <User className="w-4 h-4 mr-3 text-web3-red" />
                Full profile form
              </li>
              <li className="flex items-center">
                <Sparkles className="w-4 h-4 mr-3 text-web3-red" />
                NFT and meme image showcase
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-web3-magenta/10 to-web3-red/10 p-4 rounded-lg border border-web3-magenta/20">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-web3-magenta" />
              Coming Soon:
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <Wallet className="w-4 h-4 mr-3 text-web3-magenta" />
                Wallet integration
              </li>
              <li className="flex items-center">
                <Calendar className="w-4 h-4 mr-3 text-web3-magenta" />
                Real community events and meetups
              </li>
              <li className="flex items-center">
                <Instagram className="w-4 h-4 mr-3 text-web3-magenta" />
                Instagram integration
              </li>
              <li className="flex items-center">
                <Facebook className="w-4 h-4 mr-3 text-web3-magenta" />
                Facebook integration
              </li>
            </ul>
          </div>

          <div className="text-center pt-4">
            <Button 
              onClick={onEnter}
              size="lg" 
              className="bg-gradient-to-r from-web3-red to-web3-magenta hover:from-web3-red/90 hover:to-web3-magenta/90 text-white text-xl px-12 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Enter App 🚀
            </Button>
            <p className="text-sm text-gray-500 mt-3">
              Ready to explore the future of crypto dating in beta?
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MVPOverlay;
