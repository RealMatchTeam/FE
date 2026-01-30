import MainIcon from "../assets/MainIcon.svg";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-gradient-to-b from-[#E8E8F8] to-white">
            {/* Image */}
            <div className="flex justify-center w-full max-w-[200px] mb-6">
                <img src={MainIcon} alt="Page not found" className="w-full h-auto" />
            </div>

            {/* 404 Error Title */}
            <h1 className="text-[28px] font-bold text-core-1 mb-2 tracking-tight">404 ERROR</h1>

            {/* Subtitle */}
            <h2 className="text-title2 text-text-black mb-4">
                페이지를 찾을 수 없습니다.
            </h2>

            {/* Description */}
            <p className="text-title3 text-text-gray2 text-center leading-[1.5] w-full break-keep">
                페이지가 존재하지 않거나, 사용할 수 없는 페이지입니다.<br />
                입력하신 주소가 정확한지 다시 한 번 확인해주세요.
            </p>
        </div>
    );
}
