export default function Section({
  title,
  right,
  children,
}: {
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-[12px]">
        <div className="text-[14px] font-semibold text-black/80">{title}</div>
        {right}
      </div>
      {children}
    </section>
  );
}