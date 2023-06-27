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
    <nav className="bg-blue-300 flex w-full gap-4  p-3">
      {/* Desktop navigation */}
      <b>Productiver</b>
      <div className="sm:flex hidden">
        {session?.user ? (
          <div className="flex gap-3 md:gap-5">
            <button
              type="button"
              onClick={() => signOut()}
              className="outline_btn absolute right-3"
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
      <div className="sm:hidden flex-column relative">
        {session?.user ? (
          <div>
            <button onClick={() => setToggleDropDown((prev) => !prev)}>
              dropdown
            </button>
            {toggleDropDown && (
              <div className="dropdown flex">
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
