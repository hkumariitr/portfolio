import React from "react";
import {Profile, Icon } from "./ui/Profile";

export function ProfileContainer() {
  return (
    <div className=" flex flex-col items-start max-w-sm mx-auto p-4 relative h-[15 rem] w-[15 rem] rounded-full">
      <Profile/>
    </div>
  );
}
