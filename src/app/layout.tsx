import Nav from "@/components/Nav";
import { Inter } from "next/font/google";
import { Provider } from "@/components/Provider";
//when using metadata, you have to Type the next's Metadata type
import { Metadata } from "next";
import "./globals.css";
//this is where i think i will add session cookies
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Productiver",
  description: "Todo List by Andrew Choi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Provider>
        <body className="bg-purple-200">
          <main className="app">
            <Nav />
            {children}
          </main>
        </body>
      </Provider>
    </html>
  );
}
