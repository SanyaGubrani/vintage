import React from "react";
import { Copyright, Github } from "lucide-react";
import { Circle } from "lucide-react";
import Container from "./Container";

const Footer = () => {
  return (
    <footer className="w-full py-2 md:px-2 border-t border-muted/30  z-10">
      <Container className="flex w-full items-center justify-center mx-auto">
        <div className="w-full flex items-center justify-center">
          <div className="w-full flex items-center justify-center space-x-1 sm:space-x-5 md:space-x-6 text-sm text-accent-foreground/70 font-typewriter">
            <span className="font-newspaper tracking-wider text-xs md:text-sm">
              VINTAGE
            </span>
            <Circle className="bg-primary/50 size-1 md:size-2.5 rounded-full border-none" />
            <span className="flex text-center md:text-sm text-xs whitespace-nowrap items-center justify-center gap-1 md:gap-1.5">
              <Copyright className="rounded-full border-none size-3 md:size-4" />
              <span className="text-center">2025 Sanya Gubrani</span>
            </span>
            <Circle className="bg-primary/50 size-1 md:size-2.5 rounded-full border-none" />
            <a
              href="https://github.com/your-username"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center md:text-sm text-xs hover:text-primary hover:font-semibold transition-all duration-100 ease-in-out"
              aria-label="GitHub"
            >
              <Github className="mr-1 size-3 md:size-4" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
