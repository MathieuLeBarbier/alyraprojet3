import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import RainbowKitAndWagmiProvider from "./RainbowKitAndWagmiProvider";
import Layout from "@/components/shared/Layout";
import { Toaster } from "@/components/ui/sonner";
import { ContractProvider } from "@/contexts/useContract";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Voting DApp",
  description: "Voting DApp for Alyra Project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
      >
        <RainbowKitAndWagmiProvider>
          <ContractProvider>
            <Layout>
              {children}
            </Layout>
          </ContractProvider>
        </RainbowKitAndWagmiProvider>
        <Toaster 
          position="bottom-right" 
          toastOptions={{
            duration: 5000,
            style: {
              backgroundColor: "#262626",
              color: '#fff',
            },
          }} />
      </body>
    </html>
  );
}
