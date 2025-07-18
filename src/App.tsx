
import React, { Suspense, useEffect, useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SecurityProvider } from "@/contexts/SecurityContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingFallback } from "@/components/LoadingFallback";
import { isMobile, logMobileInfo } from "@/utils/mobileDetection";

// Lazy load components
const CopilotKit = React.lazy(() => 
  import("@copilotkit/react-core").then(module => ({ default: module.CopilotKit }))
);
const CopilotSidebar = React.lazy(() => 
  import("@copilotkit/react-ui").then(module => ({ default: module.CopilotSidebar }))
);
const CopilotProvider = React.lazy(() => 
  import("@/components/CopilotProvider").then(module => ({ default: module.CopilotProvider }))
);
const MobileApp = React.lazy(() => import("@/components/MobileApp"));

// Regular imports for core pages
import Index from "./pages/Index";
import EventsPage from "./pages/Events";
import Games from "./pages/Games";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import ProfileDetail from "./pages/ProfileDetail";
import Discover from "./pages/Discover";
import DailyMatches from "./pages/DailyMatches";
import MyMatches from "./pages/MyMatches";
import Messages from "./pages/Messages";
import Token from "./pages/Token";
import WeSupport from "./pages/WeSupport";
import NotFound from "./pages/NotFound";
import Account from "./pages/Account";
import ComprehensiveProfile from "./pages/ComprehensiveProfile";
import WhaleConnect from "./pages/WhaleConnect";

const queryClient = new QueryClient();

const App = () => {
  const [isClientMobile, setIsClientMobile] = useState<boolean | null>(null);

  useEffect(() => {
    console.log('App mounting...');
    logMobileInfo();
    
    // Set mobile detection after component mounts
    setIsClientMobile(isMobile());
    
    // Add error listener
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
    });

    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
    });
  }, []);

  // Show loading while determining if mobile
  if (isClientMobile === null) {
    return <LoadingFallback />;
  }

  // Mobile version - lightweight without CopilotKit
  if (isClientMobile) {
    console.log('Rendering mobile version...');
    return (
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <MobileApp />
          </Suspense>
        </ErrorBoundary>
      </QueryClientProvider>
    );
  }

  // Desktop version - full featured
  console.log('Rendering desktop version...');
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <ThemeProvider>
          <AuthProvider>
            <SecurityProvider>
              <TooltipProvider>
                <Suspense fallback={<LoadingFallback />}>
                  <CopilotKit runtimeUrl="https://pizlzaomylxreizohewd.supabase.co/functions/v1/copilot-chat">
                    <Toaster />
                    <Sonner />
                    <BrowserRouter>
                      <CopilotSidebar>
                        <CopilotProvider>
                          <Routes>
                            <Route path="/" element={<Index />} />
                            <Route path="/daily-matches" element={<DailyMatches />} />
                            <Route path="/my-matches" element={<MyMatches />} />
                            <Route path="/messages" element={<Messages />} />
                            <Route path="/events" element={<EventsPage />} />
                            <Route path="/games" element={<Games />} />
                            <Route path="/auth" element={<Auth />} />
                            <Route path="/account" element={<Account />} />
                            <Route path="/profile/setup" element={<Profile />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/profile/edit" element={<Profile />} />
                            <Route path="/profile/comprehensive" element={<ComprehensiveProfile />} />
                            <Route path="/profile/:profileId" element={<ProfileDetail />} />
                            <Route path="/discover" element={<Discover />} />
                            <Route path="/token" element={<Token />} />
                            <Route path="/whale-connect" element={<WhaleConnect />} />
                            <Route path="/we-support" element={<WeSupport />} />
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </CopilotProvider>
                      </CopilotSidebar>
                    </BrowserRouter>
                  </CopilotKit>
                </Suspense>
              </TooltipProvider>
            </SecurityProvider>
          </AuthProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
};

export default App;
