"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MESSAGES } from "@/lib/message";

export default function Footer() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return (
    <footer className="p-2 text-center">
      <Button variant="ghost">
        <Home className="size-4" />
        <Link href="/">
          {MESSAGES.footer.backToTop}
        </Link>
      </Button>
      <p>{MESSAGES.footer.copyright}</p>
    </footer>
  );
}
