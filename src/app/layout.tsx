import Nav from "@/components/Nav";
import "./globals.css";
import { Inter } from "next/font/google";
import { Provider } from "@/components/Provider";
//this is where i think i will add session cookies
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
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
      <body>
        <Provider>
          <div className="main">
            <div className="gradient" />
          </div>
          <main className="app">
            <Nav />
            {children}
          </main>
        </Provider>
      </body>
    </html>
  );
}
