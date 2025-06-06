"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="py-4 flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 z-50 h-20 md:h-12">
      <p className="text-sm text-gray-600">
        &copy; {new Date().getFullYear()} Autora. All rights reserved.
      </p>
      <p className="text-sm text-gray-600">Made with ❤️. Project by Vedant Uekey</p>
      <div className="flex space-x-4 mt-4 sm:mt-0">
        <Link
          href={"https://vedantuekey.vercel.app"}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button className="flex items-center space-x-1" variant={"link"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 21a6 6 0 0 0-12 0" />
              <circle cx="12" cy="11" r="4" />
              <rect width="18" height="18" x="3" y="3" rx="2" />
            </svg>
            <span className="hidden md:flex">Profile</span>
          </Button>
        </Link>

        <Link
          href={"https://www.github.com/code-vedant"}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button className="flex items-center space-x-1" variant={"link"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
            <span className="hidden md:flex">GitHub</span>
          </Button>
        </Link>

        <Link href={"https://www.linkedin.com/in/vedantuekey"} target="_blank">
          <Button className="flex items-center space-x-1" variant={"link"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect width="4" height="12" x="2" y="9" />
              <circle cx="4" cy="4" r="2" />
            </svg>
            <span className="hidden md:flex">LinkedIn</span>
          </Button>
        </Link>
      </div>
    </footer>
  );
};
