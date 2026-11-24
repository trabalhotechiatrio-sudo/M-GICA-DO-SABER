import type { Metadata } from 'next';
import { Fredoka, Nunito } from 'next/font/google';
import './globals.css';

const fredoka = Fredoka({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Mágica do Saber — Jogos Educativos do 1º ao 5º Ano',
  description:
    'Plataforma kawaii e colorida de jogos educativos de Português e Matemática para crianças do 1º ao 5º ano do Ensino Fundamental 1.',
  icons: {
    icon: '/assets/aistudio/Gatinho_kawaii_a_ler_com_ternura_670f95ac.png',
  },
  openGraph: {
    title: 'Mágica do Saber — Jogos Educativos do 1º ao 5º Ano',
    description:
      'Plataforma kawaii e colorida de jogos educativos de Português e Matemática para crianças do 1º ao 5º ano do Ensino Fundamental 1.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${fredoka.variable} ${nunito.variable}`}>
      <body className="bg-[#F7D8EC] text-[#3D2C3E] antialiased selection:bg-[#FFD6E0] selection:text-[#3D2C3E]">
        {children}
      </body>
    </html>
  );
}
