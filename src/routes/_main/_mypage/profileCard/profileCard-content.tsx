import React from "react";

type Campaign = {
  type: "보낸 제안" | "지원";
  title: string;
  date: string;
};

export default function ProfileCard() {
  const campaigns: Campaign[] = [
    { type: "보낸 제안", title: "비플레인 - ‘글로우업’ 선크림 신제품 홍보…", date: "01/24/25 완료" },
    { type: "보낸 제안", title: "라운드랩 - ‘글로우업’ 크림 신제품 홍보…", date: "01/15/25 완료" },
    { type: "지원", title: "이즈토리 - 비타크림 신제품 체험단 모집", date: "12/15/24 완료" },
  ];

  return (
    <div className="min-h-dvh w-full bg-[#2f3137] flex justify-center">
      {/* phone frame (430px) */}
      <div className="w-full max-w-[430px] bg-white overflow-hidden shadow-2xl">
        {/* status bar mock */}
        {/* header */}
        <div className="px-[23px] pb-[10px]">
          <div className="h-[44px] flex items-center justify-between">
            <button type="button" className="w-10 h-10 -ml-2 grid place-items-center">
              <span className="text-[22px] leading-none">‹</span>
            </button>
            <div className="text-[16px] font-semibold">내 프로필 카드</div>
            <div className="w-10 h-10" />
          </div>

          {/* profile summary */}
          <div className="flex items-center gap-[12px] mt-[10px]">
            <div className="relative w-[44px] h-[44px] rounded-full bg-gray-200 overflow-hidden">
              {/* 이미지 자리 */}
              <div className="absolute inset-0 bg-gradient-to-b from-gray-200 to-gray-300" />
              <div className="absolute -right-[2px] -bottom-[2px] w-[18px] h-[18px] rounded-full bg-white grid place-items-center shadow">
                <div className="w-[12px] h-[12px] rounded-full bg-[#6D6AFE]" />
              </div>
            </div>

            <div className="flex-1">
              <div className="text-[16px] font-semibold leading-[20px]">비비</div>
              <div className="text-[12px] text-black/50 leading-[16px] mt-[2px]">여성 22세</div>
              <div className="text-[12px] text-[#6D6AFE] leading-[16px] mt-[2px]">
                관심분야: 뷰티, 패션
              </div>
            </div>
          </div>
        </div>

        <div className="h-[1px] bg-black/5" />

        {/* content */}
        <div className="px-[23px] pb-[86px]">
          {/* SNS */}
          <Section title="SNS 계정">
            <div className="flex items-center gap-3">
              <div className="w-[22px] h-[22px] rounded bg-black/5 grid place-items-center">
                <span className="text-[12px] text-black/50">◎</span>
              </div>
              <div className="flex-1 text-[14px] text-black/70">www.instagram.com/vivi</div>
              <button type="button" className="text-[14px] text-black/40">
                ✎
              </button>
            </div>
          </Section>

          {/* Matching */}
          <Section title="매칭검사 결과">
            <div className="rounded-[12px] bg-[#F4F6FF] border border-[#E6E9FF] px-[16px] py-[14px] flex gap-3">
              <div className="flex-1">
                <div className="text-[14px] font-semibold text-[#3E43FF] leading-[18px]">
                  비비 님은
                </div>
                <div className="text-[14px] text-[#3E43FF] leading-[20px] mt-1">
                  OO한 크리에이터 입니다.
                  <br />
                  OO한 브랜드와 잘 어울려요.
                </div>
              </div>
              <div className="w-[56px] h-[56px] rounded-[12px] bg-[#E9ECFF] grid place-items-center">
                <div className="w-[30px] h-[30px] rounded-full bg-[#6D6AFE]/20" />
              </div>
            </div>
          </Section>

          {/* Traits */}
          <Section
            title="내 특성"
            right={
              <button type="button" className="text-[20px] text-black/30 -mr-1">
                ›
              </button>
            }
          >
            <div className="grid grid-cols-2 gap-[12px]">
              <TraitCard
                badge="뷰티 특성"
                icon="🧴"
                lines={["피부 타입  건성, 민감성…", "피부 밝기  17~21호", "메이크업  내추럴, 글로우…"]}
              />
              <TraitCard
                badge="패션 특성"
                icon="👗"
                lines={["키  165cm", "체형  웨이브", "상의  S", "하의  33 inch"]}
              />
            </div>
          </Section>

          {/* Campaigns */}
          <Section
            title="진행한 캠페인"
            right={
              <button type="button" className="text-[20px] text-black/30 -mr-1">
                ˅
              </button>
            }
          >
            <div className="space-y-[12px]">
              {campaigns.map((c, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[12px] text-[#6D6AFE] shrink-0">{c.type}</span>
                    <span className="text-[14px] text-black/70 truncate">{c.title}</span>
                  </div>
                  <span className="text-[12px] text-black/40 shrink-0">{c.date}</span>
                </div>
              ))}

              {/* pagination mock */}
              <div className="pt-[10px] flex items-center justify-center gap-2 text-[12px] text-black/40">
                <button className="w-8 h-8 grid place-items-center">‹</button>
                <button className="w-8 h-8 rounded-[8px] bg-[#EEF0FF] text-[#3E43FF] font-semibold">
                  1
                </button>
                <button className="w-8 h-8 grid place-items-center">2</button>
                <button className="w-8 h-8 grid place-items-center">3</button>
                <button className="w-8 h-8 grid place-items-center">4</button>
                <button className="w-8 h-8 grid place-items-center">›</button>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  right,
  children,
}: {
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="pt-[18px]">
      <div className="flex items-center justify-between mb-[12px]">
        <div className="text-[14px] font-semibold text-black/80">{title}</div>
        {right}
      </div>
      {children}
    </section>
  );
}

function TraitCard({
  badge,
  icon,
  lines,
}: {
  badge: string;
  icon: string;
  lines: string[];
}) {
  return (
    <div className="rounded-[12px] border border-black/5 bg-white p-[14px]">
      <div className="inline-flex items-center rounded-full bg-[#EEF0FF] px-[10px] py-[6px] text-[12px] font-semibold text-[#3E43FF]">
        {badge}
      </div>

      <div className="mt-[12px] h-[62px] rounded-[12px] bg-[#F5F6FF] grid place-items-center">
        <span className="text-[22px]">{icon}</span>
      </div>

      <div className="mt-[12px] space-y-[6px] text-[12px] text-black/45 leading-[16px]">
        {lines.map((t, i) => (
          <div key={i}>{t}</div>
        ))}
      </div>
    </div>
  );
}
