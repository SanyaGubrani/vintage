import React from "react";
import { useAuthStore } from "../store/useAuthStore";

const Navbar = () => {

  return (
    <div className="flex items-center lg:flex-row flex-col justify-center gap-5">
      <div className="text-center">
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-widest text-[#4f463b] mb-2"
          style={{
            textShadow: "2px 2px 2px #C2B8A3, 4px 4px 0 #A59E8C",
            letterSpacing: "0.2em",
          }}
        >
          VINTAGE
        </h1>
        <p className="text-muted-foreground font-typewriter">
          Memories fade, but stories remain.
        </p>
      </div>
    </div>
  );
};

export default Navbar;
