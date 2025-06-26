
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Users, Wallet, Calendar, User } from 'lucide-react';

interface MVPOverlayProps {
  onEnter: () => void;
}

const MVPOverlay = ({ onEnter }: MVPOverlayProps) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full bg-white/95 backdrop-blur-sm border-2 border-gradient-to-r from-[#FBE24F] to-[#FFA70F] shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-[#FBE24F] to-[#FFA70F] rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-gray-800" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-[#F51F3B] to-[#E809CB] bg-clip-text text-transparent">
            Welcome to BOINK MVP!
          </CardTitle>
          <p className="text-lg text-gray-600 mt-2">
            Where Degens Find Their Forever Person
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-gradient-to-r from-[#FBE24F]/10 to-[#FFA70F]/10 p-4 rounded-lg border border-[#FFA70F]/20">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              <Users className="w-5 h-5 mr-2 text-[#F51F3B]" />
              What's Available Now:
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-[#F51F3B] rounded-full mr-3" />
                Demo profiles to explore the matching experience
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-[#F51F3B] rounded-full mr-3" />
                Google login authentication
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-[#F51F3B] rounded-full mr-3" />
                Profile creation and customization
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-[#F51F3B] rounded-full mr-3" />
                Demo community events
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-[#E809CB]/10 to-[#F51F3B]/10 p-4 rounded-lg border border-[#E809CB]/20">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-[#E809CB]" />
              Coming Soon:
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-[#E809CB] rounded-full mr-3" />
                Full social media integration
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-[#E809CB] rounded-full mr-3" />
                Crypto wallet connectivity
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-[#E809CB] rounded-full mr-3" />
                Real community events and meetups
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-[#E809CB] rounded-full mr-3" />
                Advanced matching algorithms
              </li>
            </ul>
          </div>

          <div className="text-center pt-4">
            <Button 
              onClick={onEnter}
              size="lg" 
              className="bg-gradient-to-r from-[#F51F3B] to-[#E809CB] hover:from-[#F51F3B]/90 hover:to-[#E809CB]/90 text-white text-xl px-12 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Enter App 🚀
            </Button>
            <p className="text-sm text-gray-500 mt-3">
              Ready to explore the future of crypto dating?
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MVPOverlay;
