import Nav from "@/components/layout/nav";

export default function OthersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="max-w-7xl w-full mx-auto px-2 py-2 md:px-4 md:py-4 relative">
      <Nav />
      {children}
    </section>
  );
}