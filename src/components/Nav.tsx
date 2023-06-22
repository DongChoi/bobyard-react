"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { getProviders, signIn, signOut, useSession } from "next-auth/react";
const Nav = () => {
  const { data: session } = useSession();
  //next-auth JS
  console.log(session);
  const [providers, setProviders] = useState<Record<string, any> | null>(null);
  const [toggleDropDown, setToggleDropDown] = useState(false);
  useEffect(() => {
    const setUpProviders = async () => {
      const response = await getProviders();
      console.log(response);
      setProviders(response);
    };
    setUpProviders();
  }, []);

  return (
    <nav className="bg-blue-300 flex w-full gap-4  p-2">
      <Link href="/" className="flex ">
        Home
        <Image
          src="/checklist.png"
          width={30}
          height={30}
          alt="profile logo"
          className="object-contain fill-white"
        />
      </Link>

      {/* Desktop navigation */}
      <Link href="/tasks">
        {/* <Image/> */}
        Tasks
      </Link>
      <div className="sm:flex hidden">
        {session?.user ? (
          <div className="flex gap-3 md:gap-5">
            <Link href="/create-task" className="black_btn">
              Create Task
            </Link>
            <button
              type="button"
              onClick={() => signOut()}
              className="outline_btn absolute right-0"
            >
              Sign Out{" "}
            </button>
          </div>
        ) : (
          <>
            {/* show all provider buttons */}
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  type="button"
                  key={provider.name}
                  onClick={() => signIn(provider.id)}
                >
                  SignIn
                </button>
              ))}
          </>
        )}
      </div>

      {/* mobile navigation */}
      <div className="sm:hidden flex relative">
        {session?.user ? (
          <div>
            <button onClick={() => setToggleDropDown((prev) => !prev)}>
              log in
            </button>
            {toggleDropDown && (
              <div className="dropdown">
                <Link
                  href="/tasks"
                  className="dropdown_link"
                  onClick={() => setToggleDropDown(false)}
                >
                  My Tasks
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setToggleDropDown(false);
                    console.log("signing out?");
                    signOut();
                  }}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* show all provider buttons */}
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  type="button"
                  key={provider.name}
                  onClick={() => signIn(provider.id)}
                ></button>
              ))}
          </>
        )}
      </div>
    </nav>
  );
};

export default Nav;
