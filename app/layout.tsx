import type { Metadata } from "next";
import "./globals.css";
import StyledComponentsRegistry from "../lib/providers/StyledComponentsRegistry";

export const metadata: Metadata = {
  title: "Starsoft Products",
  description: "Lista de produtos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
