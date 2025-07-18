import React from 'react';
import { IntelligentAIChat } from '@/components/ai/IntelligentAIChat';
import Header from '@/components/header/Header';
import Footer from '@/components/Footer';

const AIChat: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-4">
              Intelligent AI Assistant
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience advanced AI with conversation memory, context awareness, and personalized responses
              tailored to your profile and interaction history.
            </p>
          </div>
          
          <IntelligentAIChat className="max-w-7xl mx-auto" />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AIChat;