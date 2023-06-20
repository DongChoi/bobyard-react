"use client";

import Feed from "@/components/Feed";

//this is basically  app.tsx

const Home = () => {
  return (
    <section className="w-full flex-center">
      <h1 className="">Welcome!!</h1>
      <span className="satoshi primary-orange"> Raise your productivity </span>
      <Feed />
    </section>
  );
};

export default Home;
