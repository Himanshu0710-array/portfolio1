import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Himanshu Chandlani | Portfolio',
  description: 'ML Engineer & Full-Stack Developer - 3D Space Portfolio',
  openGraph: {
    title: 'Himanshu Chandlani | Portfolio',
    description: 'Turning ideas into intelligent and user-friendly applications. Exploring AI, ML, and Web Technologies.',
    url: 'https://portfolio-lake-nu-74.vercel.app/',
    siteName: 'Himanshu Chandlani Portfolio',
    images: [
      {
        url: 'https://portfolio-lake-nu-74.vercel.app/og-image.jpg', // Recommend user adds an og-image.jpg to public/
        width: 1200,
        height: 630,
        alt: 'Himanshu Chandlani Portfolio Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white antialiased overflow-hidden`}>
        {children}
      </body>
    </html>
  );
}
