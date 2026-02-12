import PillChip from "./PillChip";

type Props = {
  label: string;
  chips: string[];
};

export default function TagGroup({ label, chips }: Props) {
  return (
    <div className="flex items-start">
      <div className="min-w-22.5 pt-[2px] text-title3 text-text-gray3">
        {label}
      </div>
      <div className="flex flex-wrap gap-1 px-4">
        {chips.map((c) => (
          <PillChip key={c} variant="outline">
            {c.startsWith("#") ? c : `#${c}`}
          </PillChip>
        ))}
      </div>
    </div>
  );
}
