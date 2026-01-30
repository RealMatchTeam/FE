interface Props {
  label: string;
  children: React.ReactNode;
  right?: React.ReactNode;
}

export default function CampaignInfoGroup({
  label,
  right,
  children,
}: Props) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        <span className="text-[14px] font-medium text-[var(--color-text-black)]">
          {label}
        </span>
        {right}
      </div>
      {children}
    </div>
  );
}
