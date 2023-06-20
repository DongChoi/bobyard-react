"use client";

import React from "react";

const page = ({ params }: { params: { task: string } }) => {
  return (
    <div>
      this is task #{params.task} <p>add indepth task info here</p>
    </div>
  );
};
export default page;
