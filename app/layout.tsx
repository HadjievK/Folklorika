import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'Фолклорика - Национална платформа за български фолклор',
  description: 'Платформа за фолклорни сдружения, събития, концерти и фестивали в България',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bg">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
