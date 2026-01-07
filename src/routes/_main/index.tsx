import { createFileRoute } from "@tanstack/react-router";
import Header from "../../components/layout/Header";

export const Route = createFileRoute("/_main/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div>
      <Header title="홈" />
      <main className="p-4">
        <div className="bg-grad-calendar-1 rounded-2xl p-6 text-white mb-6">
          <h2 className="text-callout4 mb-2">환영합니다!</h2>
          <p className="text-body1">Real Match에서 새로운 인연을 만나보세요</p>
        </div>

        <div className="space-y-4">
          <div className="bg-bluegray-1 rounded-xl p-4">
            <h3 className="text-title1 text-text-black mb-2">오늘의 추천 매칭</h3>
            <p className="text-body1 text-text-gray2">
              아직 추천 매칭이 없습니다
            </p>
          </div>

          <div className="bg-bluegray-1 rounded-xl p-4">
            <h3 className="text-title1 text-text-black mb-2">최근 활동</h3>
            <p className="text-body1 text-text-gray2">활동 내역이 없습니다</p>
          </div>
        </div>
      </main>
    </div>
  );
}
