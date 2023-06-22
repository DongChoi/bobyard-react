"use client";

import React from "react";

const page = ({ params }: { params: { taskId: string } }) => {
  return (
    <div>
      this is task #{params.taskId} <p>add indepth task info here</p>
    </div>
  );
};
export default page;
