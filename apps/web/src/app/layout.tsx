import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Seven Wonders',
  description: 'Seven Wonders Application',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}