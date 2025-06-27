import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TanstackProvider } from "@/providers/TanstackProvider";
import { Header } from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fiscal de Brasília",
  description:
    "Aplicação para fiscalização de gastos dos deputados em Brasília",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className={`${inter.className} min-h-full`}>
        <TanstackProvider>
          <Header />
          <main className="pt-16">{children}</main>
        </TanstackProvider>
      </body>
    </html>
  );
}
