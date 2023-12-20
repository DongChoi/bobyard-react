"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
const Nav = () => {
  const [toggleDropDown, setToggleDropDown] = useState(false);

  return (
    <nav className="bg-[#396ae6] flex justify-between gap-4 relative p-3">
      <Link href="/" className="" onClick={() => setToggleDropDown(false)}>
        <b className="text-[#F1FAEE]">Bobyard</b>
      </Link>

      <div className="hidden sm:block">
        <div className="flex gap-3 md:gap-5"></div>
      </div>
    </nav>
  );
};

export default Nav;
