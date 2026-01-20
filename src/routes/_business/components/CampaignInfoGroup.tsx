interface Props {
  label: string;
  icon?: string;
  children: React.ReactNode;
  isDropdown?: boolean;
}

export default function CampaignInfoGroup({ label, icon, children, isDropdown }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="text-[15px] font-bold text-[#222]">{label}</span>
          {icon && <span className="text-[14px]">{icon}</span>}
        </div>
        {isDropdown && <span className="text-[16px] text-[#222]">∨</span>}
      </div>
      {children}
    </div>
  );
}