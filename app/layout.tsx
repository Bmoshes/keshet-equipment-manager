import type { Metadata } from "next";
import "@fontsource/assistant/400.css";
import "@fontsource/assistant/600.css";
import "@fontsource/assistant/700.css";
import "@fontsource/assistant/800.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "ניהול ציוד | קשת פיננסים",
  description: "מערכת פנימית לניהול והשאלת ציוד משרדי",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="he" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
