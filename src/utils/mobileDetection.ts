
export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const isMobileUserAgent = mobileRegex.test(userAgent);
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isSmallScreen = window.innerWidth <= 768;
  
  return isMobileUserAgent || (isTouchDevice && isSmallScreen);
};

export const logMobileInfo = () => {
  console.log('Mobile Detection Info:', {
    userAgent: navigator.userAgent,
    isMobile: isMobile(),
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
    touchPoints: navigator.maxTouchPoints,
    ontouchstart: 'ontouchstart' in window
  });
};
