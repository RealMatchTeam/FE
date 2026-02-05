import { isRouteErrorResponse, useNavigate, useRouteError } from "react-router";
import { MatchingTestRequiredError } from "../api/matching";

export default function CampaignMatchingErrorBoundary() {
    const error = useRouteError();
    const navigate = useNavigate();

    // 매칭 검사 필요 에러인 경우
    if (error instanceof MatchingTestRequiredError) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-white">
                <h2 className="text-xl font-bold mb-4">매칭 분석이 필요해요</h2>
                <p className="text-gray-600 mb-8">
                    캠페인 매칭 서비스를 이용하려면<br />
                    먼저 나의 성향을 분석해야 합니다.
                </p>
                <button
                    onClick={() => navigate("/matching/test/step1")}
                    className="px-6 py-3 bg-core-1 text-white rounded-lg font-bold hover:bg-core-1/90 transition-colors"
                >
                    매칭 분석 시작하기
                </button>
            </div>
        );
    }

    // 기타 에러 처리
    console.error(error);
    return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-white">
            <h2 className="text-xl font-bold mb-4">서비스 이용에 불편을 드려 죄송합니다</h2>
            <p className="text-gray-600 mb-8">
                일시적인 오류가 발생했습니다.<br />
                잠시 후 다시 시도해 주세요.
            </p>
            <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-bold hover:bg-gray-300 transition-colors"
            >
                새로고침
            </button>
        </div>
    );
}
