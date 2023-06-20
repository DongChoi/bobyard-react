"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";
const Nav = () => {
  const isUserLoggedIn = true;
  //next-auth JS
  const [providers, setProviders] = useState(null);
  const [toggleDropDown, setToggleDropDown] = useState(false);
  useEffect(() => {
    const setProviders = async () => {
      const response = await getProviders();

      setProviders(response);
    };
  }, []);
  return (
    <nav className="flex-between w-full mb-16 pt-3">
      <Link href="/" className="flex gap-2 flex-center">
        Profile
        <Image
          src="@/public/next.svg"
          width={30}
          height={30}
          alt="profile logo"
          className="object-contain"
        />
      </Link>

      {/* Desktop navigation */}
      <div className="sm:flex hidden">
        {isUserLoggedIn ? (
          <div className="flex gap-3 md:gap-5">
            <Link href="/create-task" className="black_btn">
              Create Task
            </Link>
            <button type="button" onClick={signOut} className="outline_btn">
              Sign Out{" "}
            </button>
            <Link href="/tasks">
              {/* <Image/> */}
              Tasks
            </Link>
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

      {/* mobile navigation */}
      <div className="sm:hidden flex relative">
        {isUserLoggedIn ? (
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
