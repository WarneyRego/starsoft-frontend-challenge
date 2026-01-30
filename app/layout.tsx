import type { Metadata } from "next";
import { Poppins, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import StyledComponentsRegistry from "../lib/providers/StyledComponentsRegistry";
import { CombinedProvider } from "../lib/redux/Provider";
import { PageTransitionProvider } from "../lib/providers/PageTransitionContext";
import PageTransitionOverlay from "./components/PageTransitionOverlay";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-ibm-plex-sans",
});

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
    <html lang="pt-BR" className={`${poppins.variable} ${ibmPlexSans.variable}`}>
      <body>
        <CombinedProvider>
          <PageTransitionProvider>
            <StyledComponentsRegistry>
              {children}
              <PageTransitionOverlay />
            </StyledComponentsRegistry>
          </PageTransitionProvider>
        </CombinedProvider>
      </body>
    </html>
  );
}
