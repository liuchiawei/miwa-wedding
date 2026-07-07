import { MESSAGES } from "@/lib/message";

export default function Header() {
  return (
    <header className="size-full mx-auto flex-1 flex flex-col justify-center bg-yellow-300 border">
      <h1 className="text-2xl font-bold text-center">Miwa Wedding</h1>
      <section className="text-center">
        <p>
          {MESSAGES.site.date}: {MESSAGES.wedding.date}
        </p>
        <p>
          {MESSAGES.site.location}: {MESSAGES.wedding.location}
        </p>
      </section>
    </header>
  );
}
