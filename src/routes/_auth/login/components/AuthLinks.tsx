interface AuthLinksProps {
  onSignUpClick: () => void;
}

export function AuthLinks({ onSignUpClick }: AuthLinksProps) {
  return (
    <div className="flex justify-center items-center mt-6 space-x-3 text-callout4 text-text-gray3">
      <button className="cursor-pointer hover:text-text-gray2">아이디 찾기</button>
      <span className="w-px h-3 bg-text-gray4" />
      <button className="cursor-pointer hover:text-text-gray2">비밀번호 찾기</button>
      <span className="w-px h-3 bg-text-gray4" />
      <button onClick={onSignUpClick} className="cursor-pointer hover:text-text-gray2">
        회원가입
      </button>
    </div>
  );
}
