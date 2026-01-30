import PillChip from "./PillChip";

type Props = {
  label: string;
  chips: string[];
};

export default function TagGroup({ label, chips }: Props) {
  return (
    <div className="flex items-start gap-3">
      <div className="min-w-[64px] pt-[2px] text-[12px] text-text-gray3">
        {label}
      </div>
      <div className="flex flex-wrap gap-2">
        {chips.map((c) => (
          <PillChip key={c} variant="outline">
            {c}
          </PillChip>
        ))}
      </div>
    </div>
  );
}
