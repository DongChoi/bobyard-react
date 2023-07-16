"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { getProviders, signIn, signOut, useSession } from "next-auth/react";
const Nav = () => {
  const { data: session } = useSession();
  //next-auth JS
  // console.log(session);
  const [providers, setProviders] = useState<Record<string, any> | null>(null);
  const [toggleDropDown, setToggleDropDown] = useState(false);
  useEffect(() => {
    const setUpProviders = async () => {
      const response = await getProviders();
      // console.log(response);
      setProviders(response);
    };
    setUpProviders();
  }, []);

  return (
    <nav className="bg-[#E63946] flex justify-between gap-4 relative p-3">
      <Link href="/" className="" onClick={() => setToggleDropDown(false)}>
        <b className="text-[#F1FAEE]">Productiver</b>
      </Link>

      {/* Desktop navigation */}
      <div className="sm:flex hidden">
        {session?.user ? (
          <div className="flex gap-3 md:gap-5">
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className=" text-[#F1FAEE] outline_btn absolute right-3"
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
      {session?.user ? (
        <>
          <Image
            className="sm:hidden"
            src="hamburger-menu.svg"
            alt="hamburger menu svg"
            width={25}
            height={25}
            onClick={() => setToggleDropDown((prev) => !prev)}
          />

          {/* {toggleDropDown && ( */}
          <div
            className={`dropdown absolute overflow-hidden w-full left-0 top-0 z-20 ${
              toggleDropDown ? "translate-y-12" : "-translate-y-full"
            } pt-2 pb-2 duration-300 ease-in transition-all pr-3 pl-10 text-right  bg-red-400 text-[#F1FAEE]`}
          >
            <div>
              <Link
                href="/tasks"
                className=""
                onClick={() => setToggleDropDown(false)}
              >
                My Tasks
              </Link>
            </div>
            <button
              type="button"
              className="pt-2"
              onClick={() => {
                setToggleDropDown(false);
                signOut();
              }}
            >
              Sign Out
            </button>
          </div>
        </>
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
                Sign In
              </button>
            ))}
        </>
      )}
    </nav>
  );
};

export default Nav;
