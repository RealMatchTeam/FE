const PRIMARY = "#6666E5";

export type HistoryRowItem = {
  id: string;
  title: string;
  rightText?: string;
  highlight?: boolean;
};

type Props = {
  item: HistoryRowItem;
};
function ellipsis(text: string, max: number) {
  if (!text) return "";
  return text.length > max ? text.slice(0, max) + "..." : text;
}


export default function HistoryRow({ item }: Props) {
  return (
    <div className="flex items-center border-b border-bluegray-2 py-3">
      <div className="min-w-0 flex-1 truncate text-title4 text-text-black">
  {ellipsis(item.title, 30)}
      </div>

      {item.rightText && (
        <div className="w-[140px] shrink-0 text-right">
          <span
            className="text-[14px] font-semibold"
            style={{ color: item.highlight ? PRIMARY : "#9B9BA1" }}
          >
            {item.rightText}
          </span>
        </div>
      )}
    </div>
  );
}
