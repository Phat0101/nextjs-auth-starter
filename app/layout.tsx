// app/layout.tsx
import "./globals.css";
import Header from "./Header";

export const metadata = {
  title: "DTAL Audit",
  description: "DTAL customs audit system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
