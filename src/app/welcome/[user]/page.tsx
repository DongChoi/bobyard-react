"use client";

import React from "react";

const page = ({ params }: { params: { user: string } }) => {
  return <div>Hello, {params.user}</div>;
};
export default page;
