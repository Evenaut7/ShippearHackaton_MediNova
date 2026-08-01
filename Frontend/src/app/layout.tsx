import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { PatientsProvider } from "@/context/patients-context";
import { ProfessionalsProvider } from "@/context/professionals-context";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MediNova — Asistencia clínica con IA",
  description:
    "Sistema de asistencia clínica: historial de pacientes y reportes generados por IA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ProfessionalsProvider>
          <PatientsProvider>{children}</PatientsProvider>
        </ProfessionalsProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
