"use client";

import Feed from "@/components/Feed";
import { useSession } from "next-auth/react";
import "./globals.css";
//this is basically  app.tsx

const Home = () => {
  const { data: session } = useSession();

  return (
    <>
      {session?.user ? (
        <section>
          <h1>Welcome back {session.user.name}!</h1>
          <h3>
            Remember to go at your own pace and don&apos;t be critical of
            yourself!
          </h3>
        </section>
      ) : (
        <section className=" w-full flex-center">
          <h1 className="">You have reached Productiver</h1>
          <span className="satoshi primary-orange">
            We will help increase your productivity
          </span>
          <Feed />
        </section>
      )}
    </>
  );
};

export default Home;
