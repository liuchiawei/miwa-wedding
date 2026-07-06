export default function PageContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="max-w-7xl mx-auto px-2 py-2 md:px-4 md:py-4">
      {children}
    </section>
  );
}
