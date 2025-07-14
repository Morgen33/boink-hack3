
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SimpleAuthProvider } from "@/contexts/SimpleAuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import { SecurityProvider } from "@/contexts/SecurityContext";
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
import PlatformIntent from "./pages/PlatformIntent";
import Account from "./pages/Account";
import ComprehensiveProfile from "./pages/ComprehensiveProfile";
import WhaleRegistration from "./pages/WhaleRegistration";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <SimpleAuthProvider>
        <SecurityProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/daily-matches" element={<DailyMatches />} />
                <Route path="/my-matches" element={<MyMatches />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/games" element={<Games />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/platform-intent" element={<PlatformIntent />} />
                <Route path="/account" element={<Account />} />
                <Route path="/profile/setup" element={<Profile />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/edit" element={<Profile />} />
                <Route path="/profile/comprehensive" element={<ComprehensiveProfile />} />
                <Route path="/profile/:profileId" element={<ProfileDetail />} />
                <Route path="/discover" element={<Discover />} />
                <Route path="/token" element={<Token />} />
                <Route path="/we-support" element={<WeSupport />} />
                <Route path="/whale-registration" element={<WhaleRegistration />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </SecurityProvider>
      </SimpleAuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
