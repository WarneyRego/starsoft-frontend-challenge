import type { Metadata } from "next";
import "./globals.css";
import StyledComponentsRegistry from "../lib/providers/StyledComponentsRegistry";
import { ReduxProvider } from "../lib/redux/Provider";

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
        <ReduxProvider>
          <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
        </ReduxProvider>
      </body>
    </html>
  );
}
