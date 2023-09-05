import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Provider from "./_trpc/Provider";
import Header from "@/components/ui/header";
import { YPresenceProvider } from "@/contexts/yPresenceContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ubiquitodo",
  description: "Homework Task for Ubiquiti",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <YPresenceProvider>
          <Header />
          <Provider>{children}</Provider>
          {/* <Footer /> */}
        </YPresenceProvider>
      </body>
    </html>
  );
}
