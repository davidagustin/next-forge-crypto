import { env } from '@/env';
import './styles.css';
import { DesignSystemProvider } from '@repo/design-system';
import { fonts } from '@repo/design-system/lib/fonts';
import { Toolbar } from '@repo/feature-flags/components/toolbar';
import type { ReactNode } from 'react';

type RootLayoutProperties = {
  readonly children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProperties) => (
  <html lang="en" className={fonts} suppressHydrationWarning>
    <body>
      <DesignSystemProvider
        privacyUrl={env.NEXT_PUBLIC_WEB_URL ? new URL('/legal/privacy', env.NEXT_PUBLIC_WEB_URL).toString() : '/legal/privacy'}
        termsUrl={env.NEXT_PUBLIC_WEB_URL ? new URL('/legal/terms', env.NEXT_PUBLIC_WEB_URL).toString() : '/legal/terms'}
        helpUrl={env.NEXT_PUBLIC_DOCS_URL || '/docs'}
      >
        {children}
      </DesignSystemProvider>
      <Toolbar />
    </body>
  </html>
);

export default RootLayout;
