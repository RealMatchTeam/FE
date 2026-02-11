import emptyImg from "../../../assets/empty.png";

export function EmptyPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <img src={emptyImg} alt="" className="h-auto w-[210px] select-none" />
      <p className="font-medium text-[14px] text-[#5B5D6B] text-center mt-2">
        받은 채팅이 없어요
      </p>
    </div>
  );
}