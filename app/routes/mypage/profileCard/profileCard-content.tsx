import React from "react";
import NavigationHeader from "../../../components/common/NavigateHeader";

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
    <div className="min-h-dvh w-full flex justify-center">
      <div className="w-full max-w-[430px] bg-white overflow-hidden shadow-2xl">
        {/* header */}
        <div className="absolute top-0 left-0 right-0 z-50">
          <NavigationHeader
            title={"내 프로필 카드"}
            onBack={() => history.back()}
          />
        </div>

        <div className="px-4 py-6">
          {/* profile summary */}
          <div className="flex items-center gap-4 mt-[10px]">
            <div className="relative w-[50px] h-[50px] rounded-[20px] border border-[#E6E6F3] bg-gray-200 overflow-hidden">
              {/* 이미지 자리 */}
              <div className="absolute inset-0 bg-gradient-to-b from-gray-200 to-gray-300" />
              <div className="absolute -right-[2px] -bottom-[2px] w-[18px] h-[18px] rounded-full bg-white grid place-items-center shadow">
                <div className="w-[12px] h-[12px] rounded-full bg-[#6D6AFE]" />
              </div>
            </div>

            <div className="flex-1 gap-[6px]">
              <div className="text-[16px] font-Semibold leading-[20px]">비비</div>
              <div className="text-[12px] text-black/50 leading-[16px] mt-[2px]">여성 22세</div>
              <div className="text-[12px] text-[#6D6AFE] leading-[16px] mt-[2px]">
                관심분야: 뷰티, 패션
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-[430px] h-[10px] bg-[#F3F3FA]"></div>

        {/* content */}
        <div className="h-[96px] px-4">
          {/* SNS */}
          <Section title="SNS 계정">
            <div className="flex items-center gap-2">
              <div className="w-[20px] h-[20px]">
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.83333 0H11.8333C14.5 0 16.6667 2.16667 16.6667 4.83333V11.8333C16.6667 13.1152 16.1574 14.3446 15.251 15.251C14.3446 16.1574 13.1152 16.6667 11.8333 16.6667H4.83333C2.16667 16.6667 0 14.5 0 11.8333V4.83333C0 3.55145 0.509225 2.32208 1.41565 1.41565C2.32208 0.509225 3.55145 0 4.83333 0ZM4.66667 1.66667C3.87102 1.66667 3.10796 1.98274 2.54535 2.54535C1.98274 3.10796 1.66667 3.87102 1.66667 4.66667V12C1.66667 13.6583 3.00833 15 4.66667 15H12C12.7956 15 13.5587 14.6839 14.1213 14.1213C14.6839 13.5587 15 12.7956 15 12V4.66667C15 3.00833 13.6583 1.66667 12 1.66667H4.66667ZM12.7083 2.91667C12.9846 2.91667 13.2496 3.02641 13.4449 3.22176C13.6403 3.41711 13.75 3.68207 13.75 3.95833C13.75 4.2346 13.6403 4.49955 13.4449 4.6949C13.2496 4.89025 12.9846 5 12.7083 5C12.4321 5 12.1671 4.89025 11.9718 4.6949C11.7764 4.49955 11.6667 4.2346 11.6667 3.95833C11.6667 3.68207 11.7764 3.41711 11.9718 3.22176C12.1671 3.02641 12.4321 2.91667 12.7083 2.91667ZM8.33333 4.16667C9.4384 4.16667 10.4982 4.60565 11.2796 5.38705C12.061 6.16846 12.5 7.22826 12.5 8.33333C12.5 9.4384 12.061 10.4982 11.2796 11.2796C10.4982 12.061 9.4384 12.5 8.33333 12.5C7.22826 12.5 6.16846 12.061 5.38705 11.2796C4.60565 10.4982 4.16667 9.4384 4.16667 8.33333C4.16667 7.22826 4.60565 6.16846 5.38705 5.38705C6.16846 4.60565 7.22826 4.16667 8.33333 4.16667ZM8.33333 5.83333C7.67029 5.83333 7.03441 6.09672 6.56557 6.56557C6.09672 7.03441 5.83333 7.67029 5.83333 8.33333C5.83333 8.99637 6.09672 9.63226 6.56557 10.1011C7.03441 10.5699 7.67029 10.8333 8.33333 10.8333C8.99637 10.8333 9.63226 10.5699 10.1011 10.1011C10.5699 9.63226 10.8333 8.99637 10.8333 8.33333C10.8333 7.67029 10.5699 7.03441 10.1011 6.56557C9.63226 6.09672 8.99637 5.83333 8.33333 5.83333Z" fill="#A7A7AD"/>
                </svg>
              </div>
              <div className="text-[14px] leading-[20px] text-[#5B5D6B]">www.instagram.com/vivi</div>
              <button type="button">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_1474_81253)">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M1.5625 8.43731V7.26294L6.1125 2.71294L7.2875 3.88731L2.7375 8.43731H1.5625ZM7.95 3.22419L8.45312 2.72106C8.48223 2.69203 8.50532 2.65755 8.52107 2.61958C8.53682 2.58162 8.54493 2.54092 8.54493 2.49981C8.54493 2.45871 8.53682 2.41801 8.52107 2.38004C8.50532 2.34207 8.48223 2.30759 8.45312 2.27856L7.72125 1.54669C7.69222 1.51758 7.65774 1.49449 7.61977 1.47874C7.58181 1.46299 7.5411 1.45488 7.5 1.45488C7.4589 1.45488 7.41819 1.46299 7.38023 1.47874C7.34226 1.49449 7.30778 1.51758 7.27875 1.54669L6.77562 2.04981L7.95 3.22419ZM0.625 8.43731V6.87481L6.61625 0.883561C6.85066 0.649222 7.16854 0.517578 7.5 0.517578C7.83146 0.517578 8.14934 0.649222 8.38375 0.883561L9.11625 1.61606C9.35059 1.85047 9.48223 2.16836 9.48223 2.49981C9.48223 2.83127 9.35059 3.14915 9.11625 3.38356L3.125 9.37481H0.625V8.43731Z" fill="#9B9BA1"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_1474_81253">
                    <rect width="10" height="10" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
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
    <section className="py-6">
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