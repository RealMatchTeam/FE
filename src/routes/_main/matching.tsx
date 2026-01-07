import { createFileRoute } from "@tanstack/react-router";
import Header from "../../components/layout/Header";

export const Route = createFileRoute("/_main/matching")({
  component: MatchingPage,
});

function MatchingPage() {
  return (
    <div>
      <Header title="매칭" />
      <main className="p-4">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-16 h-16 text-text-gray4 mb-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
            />
          </svg>
          <h3 className="text-title text-text-gray2 mb-2">아직 매칭이 없어요</h3>
          <p className="text-body1 text-text-gray3 text-center">
            프로필을 완성하고 매칭을 시작해보세요
          </p>
        </div>
      </main>
    </div>
  );
}
