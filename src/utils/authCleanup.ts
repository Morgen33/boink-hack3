// Utility to clean up auth state and prevent limbo states
export const cleanupAuthState = () => {
  try {
    // Remove standard auth tokens
    const keysToRemove: string[] = [];
    
    // Check localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        keysToRemove.push(key);
      }
    });
    
    // Remove all identified keys
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    // Check sessionStorage if it exists
    if (typeof sessionStorage !== 'undefined') {
      const sessionKeysToRemove: string[] = [];
      Object.keys(sessionStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          sessionKeysToRemove.push(key);
        }
      });
      
      sessionKeysToRemove.forEach(key => {
        sessionStorage.removeItem(key);
      });
    }
    
    console.log('🧹 Auth state cleaned up successfully');
  } catch (error) {
    console.error('Error cleaning up auth state:', error);
  }
};

export const robustSignOut = async (supabase: any) => {
  try {
    // Clean up auth state first
    cleanupAuthState();
    
    // Attempt global sign out
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (err) {
      console.warn('Global sign out failed, continuing with cleanup');
    }
    
    // Force page reload for clean state
    setTimeout(() => {
      window.location.href = '/auth';
    }, 100);
  } catch (error) {
    console.error('Error in robust sign out:', error);
    // Force reload anyway
    window.location.href = '/auth';
  }
};