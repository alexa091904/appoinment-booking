import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AdminProvider } from "@/contexts/AdminContext";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AlexaHospital | Book an Appointment",
  description: "Book an appointment at AlexaHospital online.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <AdminProvider>
          <Navbar />
          {children}
        </AdminProvider>
      </body>
    </html>
  );
}
