import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RecruitAI',
  description: 'AI recruiting workspace for athletes and college coaches',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
