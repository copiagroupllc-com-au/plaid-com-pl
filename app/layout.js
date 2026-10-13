import "./globals.css";
import { Plus_Jakarta_Sans, Syne } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });
const syne    = Syne({ subsets: ["latin"], variable: "--font-syne", display: "swap" });

export const metadata = {
  metadataBase: new URL("https://plaid.com.pl"),
  title: {
    default:  "Plaid | Financial Data Network — Poland",
    template: "%s | Plaid Poland",
  },
  description:
    "Plaid is a Poland-based financial data network enabling developers and businesses to build smarter fintech products — connecting financial accounts, powering payments, fraud prevention, lending, and open finance.",
  keywords: ["Plaid","fintech","open banking","payments","identity verification","fraud","financial data","Poland","PSD2","open finance"],
  authors: [{ name: "Plaid Inc.", url: "https://plaid.com" }],
  icons: {
    icon:     "/plaid__logo.jpg",
    shortcut: "/plaid__logo.jpg",
    apple:    "/plaid__logo.jpg",
  },
  openGraph: {
    type:        "website",
    locale:      "pl_PL",
    url:         "https://plaid.com.pl",
    siteName:    "Plaid Poland",
    title:       "Plaid | Financial Data Network — Poland",
    description: "Plaid is a Poland-based financial data network enabling developers and businesses to build smarter fintech products — connecting financial accounts, powering payments, fraud prevention, lending, and open finance.",
    images: [{ url: "/plaid__cover.jpg", width: 1200, height: 630, alt: "Plaid Poland" }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Plaid | Financial Data Network — Poland",
    description: "Plaid is a Poland-based financial data network enabling developers and businesses to build smarter fintech products — connecting financial accounts, powering payments, fraud prevention, lending, and open finance.",
    images:      ["/plaid__cover.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl" className={`${jakarta.variable} ${syne.variable}`}>
      <body className="font-sans">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
