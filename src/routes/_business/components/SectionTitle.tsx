// components/business/SectionTitle.tsx
interface SectionTitleProps {
  title: string;
}

export default function SectionTitle({ title }: SectionTitleProps) {
  return <h2 className="text-title text-text-black">{title}</h2>;
}
