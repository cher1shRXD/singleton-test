import "./globals.css";
import { NavigationStack } from "@cher1shrxd/webview-stack-kit";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`antialiased`}>
        <NavigationStack>{children}</NavigationStack>
      </body>
    </html>
  );
}
