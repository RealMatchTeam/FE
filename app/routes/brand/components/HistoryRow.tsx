const PRIMARY = "#6666E5";

export type HistoryRowItem = {
  id: string;
  title: string;
  rightText: string;
  highlight?: boolean;
};

type Props = {
  item: HistoryRowItem;
};

export default function HistoryRow({ item }: Props) {
  return (
    <div className="flex items-center border-b border-bluegray-2 py-3">
      {/* 좌측 컬럼 */}
      <div className="min-w-0 flex-1 truncate text-[13px] text-text-black">
        {item.title}
      </div>

      {/* ✅ 우측 컬럼: 고정폭 박스 안에서 우측정렬 */}
      <div className="w-[140px] shrink-0 text-right">
        <span
          className="text-[13px] font-medium"
          style={{ color: item.highlight ? PRIMARY : "#9B9BA1" }}
        >
          {item.rightText}
        </span>
      </div>
    </div>
  );
}
