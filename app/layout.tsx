import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans, Caveat } from "next/font/google";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-script",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Styled by Uriel | Premium Kids Fashion",
    template: "%s | Styled by Uriel",
  },
  description:
    "Styled by Uriel is a premium children’s fashion brand dedicated to creating stylish, comfortable, and quality outfits for kids. Shop trendy, comfortable, and durable wear with nationwide delivery across Nigeria.",
  keywords: [
    "kids fashion",
    "children clothing",
    "Nigerian kids wear",
    "premium children fashion",
    "Styled by Uriel",
    "kids fashion Nigeria",
  ],
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "Styled by Uriel",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${plusJakartaSans.variable} ${caveat.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
