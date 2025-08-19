import { AnalyticsProvider } from '@repo/analytics';
import type { ThemeProviderProps } from 'next-themes';
import { Toaster } from './components/ui/sonner';
import { TooltipProvider } from './components/ui/tooltip';
import { ThemeProvider } from './providers/theme';

type DesignSystemProviderProperties = ThemeProviderProps & {
  privacyUrl?: string;
  termsUrl?: string;
  helpUrl?: string;
};

export const DesignSystemProvider = ({
  children,
  privacyUrl,
  termsUrl,
  helpUrl,
  ...properties
}: DesignSystemProviderProperties) => {
  // Only import AuthProvider if Clerk environment variables are available
  let AuthProvider: any = null;
  
  try {
    // Check if Clerk environment variables are available
    if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
      const authModule = require('@repo/auth/provider');
      AuthProvider = authModule.AuthProvider;
    }
  } catch (_error) {
    // AuthProvider not available, continue without it
  }

  const content = (
    <AnalyticsProvider>
      <TooltipProvider>{children}</TooltipProvider>
      <Toaster />
    </AnalyticsProvider>
  );

  return (
    <ThemeProvider {...properties}>
      {AuthProvider ? (
        <AuthProvider privacyUrl={privacyUrl} termsUrl={termsUrl} helpUrl={helpUrl}>
          {content}
        </AuthProvider>
      ) : (
        content
      )}
    </ThemeProvider>
  );
};
