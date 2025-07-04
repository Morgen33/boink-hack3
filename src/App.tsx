
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import EventsPage from "./pages/Events";
import Games from "./pages/Games";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Discover from "./pages/Discover";
import DailyMatches from "./pages/DailyMatches";
import MyMatches from "./pages/MyMatches";
import WeSupport from "./pages/WeSupport";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/daily-matches" element={<DailyMatches />} />
            <Route path="/my-matches" element={<MyMatches />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/games" element={<Games />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<Profile />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/we-support" element={<WeSupport />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
