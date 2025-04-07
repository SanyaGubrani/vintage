import React from "react";
import { cn } from "@/lib/utils";

const Container = ({ children, className }) => {
  return (
    <div
      className={cn(
        "mx-auto max-w-7xl px-2 md:px-4 lg:px-6 xl:px-8 w-full",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Container;
