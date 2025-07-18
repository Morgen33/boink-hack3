
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from './ErrorBoundary';
import Index from "../pages/Index";
import Auth from "../pages/Auth";
import Profile from "../pages/Profile";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { Sonner } from "@/components/ui/sonner";

const MobileApp = () => {
  console.log('MobileApp rendering...');
  
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<Index />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default MobileApp;
