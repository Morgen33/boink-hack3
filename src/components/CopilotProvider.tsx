import React from 'react';
import { useCopilotReadable, useCopilotAction } from '@copilotkit/react-core';
import { useAuth } from '@/contexts/AuthContext';
import { useProfileData } from '@/hooks/useProfileData';

interface CopilotProviderProps {
  children: React.ReactNode;
}

export const CopilotProvider: React.FC<CopilotProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const { profile } = useProfileData();

  // Make user profile data readable by the AI
  useCopilotReadable({
    description: "User's profile information for the crypto dating app",
    value: profile ? {
      name: profile.full_name,
      age: profile.age,
      location: profile.location,
      bio: profile.bio,
      cryptoExperience: profile.crypto_experience,
      favoriteCrypto: profile.favorite_crypto,
      tradingStyle: profile.trading_style,
      portfolioSize: profile.portfolio_size,
      interests: profile.interests,
      platformIntent: profile.platform_intent,
      profileCompleted: profile.profile_completed,
      dateOfBirth: profile.date_of_birth,
      genderIdentity: profile.gender_identity,
      lookingFor: profile.looking_for,
      relationshipType: profile.relationship_type,
      defiProtocols: profile.defi_protocols,
      nftCollections: profile.nft_collections,
      biggestCryptoWin: profile.biggest_crypto_win,
      biggestCryptoLoss: profile.biggest_crypto_loss,
      cryptoMotto: profile.crypto_motto
    } : null,
  });

  // Add actions that the AI can suggest or perform
  useCopilotAction({
    name: "help_complete_profile",
    description: "Guide the user to complete missing profile sections",
    parameters: [
      {
        name: "section",
        type: "string",
        description: "The profile section that needs completion (basic_info, crypto_profile, preferences, photos)",
      }
    ],
    handler: async ({ section }) => {
      // This could navigate to the profile completion page
      return `I'll help you complete your ${section}. Let's go to your profile settings to fill this out.`;
    },
  });

  useCopilotAction({
    name: "explain_compatibility",
    description: "Explain how crypto compatibility scoring works",
    parameters: [],
    handler: async () => {
      return "Our compatibility scoring considers your crypto experience, trading style, favorite cryptocurrencies, DeFi protocol preferences, and investment philosophy. Higher compatibility means you share similar crypto interests and investment approaches with potential matches.";
    },
  });

  useCopilotAction({
    name: "suggest_conversation_starters",
    description: "Suggest conversation starters based on shared crypto interests",
    parameters: [
      {
        name: "sharedInterest",
        type: "string", 
        description: "A shared crypto interest between two users",
      }
    ],
    handler: async ({ sharedInterest }) => {
      const starters = {
        'DeFi': [
          "What's your favorite DeFi protocol and why?",
          "Have you tried yield farming? I'm curious about your experience.",
          "What do you think about the future of decentralized finance?"
        ],
        'NFTs': [
          "I see you're into NFTs! What's your favorite collection?",
          "Do you create or just collect NFTs?",
          "What got you interested in the NFT space?"
        ],
        'Bitcoin': [
          "Are you a Bitcoin maximalist or do you diversify?",
          "What's your take on Bitcoin's role as digital gold?",
          "When did you first get into Bitcoin?"
        ]
      };
      
      const relevantStarters = starters[sharedInterest as keyof typeof starters] || [
        `I noticed we both like ${sharedInterest}. What drew you to it?`,
        `How long have you been involved with ${sharedInterest}?`,
        `What's your favorite thing about ${sharedInterest}?`
      ];
      
      return `Here are some conversation starters about ${sharedInterest}:\n${relevantStarters.join('\n')}`;
    },
  });

  return <>{children}</>;
};