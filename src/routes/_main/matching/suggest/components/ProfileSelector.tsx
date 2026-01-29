interface ProfileSelectorProps {
  username?: string;
  onClick?: () => void;
}

export default function ProfileSelector({
  username = "@ivveeee",
  onClick,
}: ProfileSelectorProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between w-full py-[14px] px-4 gap-2.5 rounded-xl border border-core-70 bg-bluegray-2"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-text-gray5 flex items-center justify-center">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
              fill="#9B9BA1"
            />
          </svg>
        </div>
        <span className="text-title3 text-text-black">{username}</span>
      </div>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9 18L15 12L9 6"
          stroke="#6666E5"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
