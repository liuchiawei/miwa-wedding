"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { MESSAGES } from "@/lib/message";

export default function Nav() {
  const pathname = usePathname();
  // landing page nav
  if (pathname === "/") {
    return (
      <nav className="mx-auto p-2">
      <ul className="flex gap-4 justify-center">
        {Object.values(MESSAGES.navigation).map((item) => (
          <li key={item.href} className="hover:-translate-y-1 transition-transform">
            <Link href={item.href}>{item.text}</Link>
          </li>
        ))}
      </ul>
    </nav>
    );
  }
  // other pages nav
  return (
    <Sheet>
      <SheetTrigger className="fixed top-2 right-2">
        <Button variant="outline" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <ul>
          {Object.values(MESSAGES.navigation).map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.text}</Link>
            </li>
          ))}
        </ul>
      </SheetContent>
    </Sheet>
  );
}
