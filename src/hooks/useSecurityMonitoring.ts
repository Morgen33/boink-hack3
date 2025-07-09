import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface SecurityLog {
  id: string;
  user_id: string;
  action_type: string;
  created_at: string;
}

export const useSecurityMonitoring = () => {
  const { user } = useAuth();
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
  const [suspiciousActivity, setSuspiciousActivity] = useState(false);

  // Log security events using rate_limit_log table
  const logSecurityEvent = async (actionType: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('rate_limit_log')
        .insert({
          user_id: user.id,
          action_type: actionType
        });

      if (error) {
        console.error('Failed to log security event:', error);
      }
    } catch (error) {
      console.error('Security logging error:', error);
    }
  };

  // Get client IP (best effort)
  const getClientIP = async (): Promise<string | null> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return null;
    }
  };

  // Monitor for suspicious patterns
  const checkSuspiciousActivity = async () => {
    if (!user) return;

    try {
      // Check for multiple failed login attempts
      const { data: failedLogins } = await supabase
        .from('rate_limit_log')
        .select('*')
        .eq('user_id', user.id)
        .eq('action_type', 'failed_login')
        .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString()) // Last hour
        .limit(5);

      // Check for unusual access patterns
      const { data: accessEvents } = await supabase
        .from('rate_limit_log')
        .select('*')
        .eq('user_id', user.id)
        .in('action_type', ['login', 'profile_access', 'sensitive_action'])
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
        .limit(50);

      const isSuspicious = (failedLogins?.length || 0) > 3 || 
                          checkUnusualAccessPatterns(accessEvents || []);

      setSuspiciousActivity(isSuspicious);

      if (isSuspicious) {
        await logSecurityEvent('suspicious_activity_detected');
      }
    } catch (error) {
      console.error('Error checking suspicious activity:', error);
    }
  };

  // Check for unusual access patterns
  const checkUnusualAccessPatterns = (events: SecurityLog[]): boolean => {
    if (events.length < 5) return false;

    // Check for rapid successive actions
    const timeWindows = events.map(e => new Date(e.created_at).getTime());
    const rapidActions = timeWindows.some((time, index) => {
      if (index === 0) return false;
      return time - timeWindows[index - 1] < 1000; // Less than 1 second apart
    });

    return rapidActions;
  };

  // Fetch recent security events
  const fetchSecurityLogs = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('rate_limit_log')
        .select('id, user_id, action_type, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Failed to fetch security logs:', error);
        return;
      }

      setSecurityLogs(data || []);
    } catch (error) {
      console.error('Error fetching security logs:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSecurityLogs();
      checkSuspiciousActivity();
    }
  }, [user]);

  return {
    securityLogs,
    suspiciousActivity,
    logSecurityEvent,
    checkSuspiciousActivity,
    refreshLogs: fetchSecurityLogs
  };
};