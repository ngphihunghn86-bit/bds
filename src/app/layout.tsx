import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Công cụ bóc căn Sun Urban City",
  description: "MVP hỗ trợ sale bất động sản tư vấn nhanh hiệu quả tài chính căn hộ.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
