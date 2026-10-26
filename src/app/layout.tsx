import type { Metadata } from 'next';
import {
  IBM_Plex_Sans,
  IBM_Plex_Sans_Arabic,
  Source_Serif_4,
  Noto_Naskh_Arabic,
} from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';

const ibmPlexSans = IBM_Plex_Sans({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-ibm-plex-sans',
  display: 'swap',
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  weight: ['400', '500', '600', '700'],
  subsets: ['arabic'],
  variable: '--font-ibm-arabic',
  display: 'swap',
});

const sourceSerif = Source_Serif_4({
  weight: ['400', '600'],
  subsets: ['latin'],
  variable: '--font-source-serif',
  display: 'swap',
});

const notoNaskhArabic = Noto_Naskh_Arabic({
  weight: ['400', '600', '700'],
  subsets: ['arabic'],
  variable: '--font-noto-arabic',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ilm.me – Posez votre question à ceux qui savent',
  description:
    'Plateforme anonyme de consultation auprès d\'experts religieux et éthiques qualifiés. اسأل أهل العلم، واحتفظ باسمك.',
  keywords: ['ilm.me', 'questions anonymes', 'experts religieux', 'fiqh', 'fatwa', 'éthique', 'Algérie'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      dir="ltr"
      className={`${ibmPlexSans.variable} ${ibmPlexArabic.variable} ${sourceSerif.variable} ${notoNaskhArabic.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[var(--pg)] text-[var(--fg)]">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
