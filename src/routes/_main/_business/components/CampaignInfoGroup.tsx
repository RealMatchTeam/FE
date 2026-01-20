interface Props {
  label: string;
  children: any;
  right?: any;
}

export default function CampaignInfoGroup({
  label,
  right,
  children,
}: Props) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        <span className="text-[14px] font-medium text-[#222]">
          {label}
        </span>
        {right}
      </div>
      {children}
    </div>
  );
}
