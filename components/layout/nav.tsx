import Link from "next/link";
import { MESSAGES } from "@/lib/message";

export default function Nav() {
  return (
    <nav className="p-2">
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
