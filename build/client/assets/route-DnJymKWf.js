import{p as e,a as u,t as T,v as b,w as P}from"./chunk-JZWAC4HX-BXfHA1av.js";import{B as w}from"./Button-Ifs0z-BJ.js";import{C}from"./CheckIcon-zGj1lAt8.js";import{F as M}from"./FlowNavigation-CEie8bAj.js";import{c as y}from"./utils-fNskMoFt.js";import{u as S}from"./signupStore-CQe197yS.js";import"./mini-logo-BkLI7-Ay.js";import"./react-CGFUYhU9.js";function p({checked:s,onChange:i,label:r,required:n=!1,hasArrow:l=!1,textColor:o="text-text-black",onDetailClick:t}){return e.jsxs("div",{className:"flex items-center gap-3 w-full",children:[e.jsxs("div",{className:"flex items-center gap-3 flex-1 cursor-pointer",onClick:i,children:[e.jsx("div",{className:"flex-shrink-0",children:e.jsx(C,{checked:s})}),e.jsx("div",{className:"flex items-start gap-1 flex-1",children:e.jsxs("span",{className:`text-body1 ${o}`,children:[r," ",n&&e.jsx("span",{className:"text-callout4 text-core-1",children:"(필수)"}),!n&&e.jsx("span",{className:"text-callout4 text-text-gray3",children:"(선택)"})]})})]}),l&&e.jsx("button",{type:"button",onClick:x=>{x.stopPropagation(),t?.()},className:"p-1 -mr-1",children:e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",className:"flex-shrink-0 mt-0.5",children:e.jsx("path",{d:"M7.5 5L12.5 10L7.5 15",stroke:"#d4d4d9",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})})})]})}function R({age14:s,serviceTerms:i,privacyCollection:r,privacy3rdParty:n,eventMarketing:l,onAge14Change:o,onServiceTermsChange:t,onPrivacyCollectionChange:x,onPrivacy3rdPartyChange:m,onEventMarketingChange:g,onDetailClick:c}){return e.jsxs("div",{className:"space-y-5 px-12",children:[e.jsx(p,{checked:s,onChange:o,label:"만 14세 이상입니다",required:!0}),e.jsx(p,{checked:i,onChange:t,label:"서비스 이용약관 동의",required:!0,hasArrow:!0,onDetailClick:()=>c("serviceTerms")}),e.jsx(p,{checked:r,onChange:x,label:"개인정보 수집/이용동의",required:!0,hasArrow:!0,onDetailClick:()=>c("privacyCollection")}),e.jsx(p,{checked:n,onChange:m,label:"개인정보 제3자 제공 동의",required:!0,hasArrow:!0,onDetailClick:()=>c("privacy3rdParty")}),e.jsx(p,{checked:l,onChange:g,label:"이벤트 혜택 및 광고성 정보 수신 동의",hasArrow:!0,onDetailClick:()=>c("eventMarketing")})]})}function j({checked:s,onChange:i,label:r,onDetailClick:n}){return e.jsxs("div",{className:"flex items-center gap-1 w-full",children:[e.jsxs("div",{className:"flex items-center gap-1 flex-1 cursor-pointer",onClick:i,children:[e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",children:e.jsx("path",{d:"M5 10L8 13L15 6",stroke:s?"#6666E5":"#D4D4D9",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})}),e.jsx("span",{className:"text-title3 text-text-gray3",children:r})]}),e.jsx("button",{type:"button",onClick:l=>{l.stopPropagation(),n?.()},className:"p-1 -mr-1",children:e.jsx("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",className:"flex-shrink-0",children:e.jsx("path",{d:"M6 4L10 8L6 12",stroke:"#d4d4d9",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})})})]})}function A({privacyUsage:s,emailPush:i,onPrivacyUsageChange:r,onEmailPushChange:n,onDetailClick:l}){return e.jsxs("div",{className:"space-y-3",children:[e.jsx(j,{checked:s,onChange:r,label:"개인정보 이용 동의",onDetailClick:()=>l?.("privacyUsage")}),e.jsx(j,{checked:i,onChange:n,label:"이메일/앱 푸시 수신 동의",onDetailClick:()=>l?.("emailPush")})]})}function E({isOpen:s,onClose:i,title:r,content:n}){const[l,o]=u.useState(s);return u.useEffect(()=>{if(s){const t=setTimeout(()=>o(!0),0);return()=>clearTimeout(t)}else{const t=setTimeout(()=>o(!1),300);return()=>clearTimeout(t)}},[s]),l?e.jsxs("div",{className:"fixed inset-0 z-50 flex items-center justify-center",children:[e.jsx("div",{className:y("absolute inset-0 bg-transparent transition-opacity duration-300",s?"opacity-100":"opacity-0"),onClick:i}),e.jsxs("div",{className:y("relative w-full max-w-[375px] h-full bg-white transition-transform duration-300 ease-in-out flex flex-col shadow-xl",s?"translate-x-0":"translate-x-full"),children:[e.jsxs("div",{className:"flex items-center justify-center relative h-[56px] px-4 border-b border-gray-100",children:[e.jsx("button",{onClick:i,className:"absolute left-6 p-2 -ml-2","aria-label":"뒤로가기",children:e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",width:"11",height:"20",viewBox:"0 0 11 20",fill:"none",children:e.jsx("path",{d:"M10 1L1 10L10 19",stroke:"#5B5D6B","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round"})})}),e.jsx("h2",{className:"text-title2 text-text-black",children:r})]}),e.jsx("div",{className:"flex-1 overflow-y-auto px-6 py-6 pb-12",children:e.jsx("div",{className:"text-body1 text-text-gray1 whitespace-pre-wrap leading-relaxed",children:n})})]})]}):null}const L={serviceTerms:{title:"서비스 이용 약관",content:`제 1장 총칙

제 1 조 (목적)
본 약관은 리얼매치(이하 "회사")가 운영하는 인터넷 사이트 및 모바일 애플리케이션(이하 "서비스")과 관련하여, 회사와 회원 간의 권리, 의무 및 책임사항, 서비스 이용조건 및 절차 등을 규정함을 목적으로 합니다.

제 2 조 (용어의 정의)
본 약관에서 사용하는 용어의 정의는 다음과 같습니다.
1. "서비스"란 회사가 회원에게 제공하는 모든 제반 서비스 및 기능을 의미합니다.
2. "회원"이란 회사와 이용계약을 체결하고 회사가 제공하는 서비스를 이용하는 자를 말합니다.
3. "소셜 로그인"이란 카카오톡, 네이버 등 외부 플랫폼 계정을 통해 서비스를 이용하는 방식을 말합니다.
4. "콘텐츠"란 회원이 서비스에 게시하거나 등록한 모든 형태의 글, 이미지, 영상 등을 말합니다.
5. "이용계약"이란 회원이 회사의 서비스 이용을 신청하고 회사가 이를 승낙함으로써 성립되는 계약을 의미합니다.

제 3 조 (약관의 효력 및 변경)
1. 본 약관은 서비스를 이용하고자 하는 모든 회원에 대하여 그 효력을 발생합니다.
2. 회사는 관련 법령을 위배하지 않는 범위에서 약관을 개정할 수 있으며, 변경된 약관은 서비스 내 공지 또는 이메일 등으로 회원에게 고지합니다.
3. 회원은 변경된 약관에 동의하지 않을 경우 탈퇴할 수 있으며, 변경 이후에도 서비스를 계속 이용하는 경우 변경에 동의한 것으로 간주합니다.

제 4 조 (서비스의 제공 및 변경)
1. 회사는 회원에게 다음과 같은 서비스를 제공합니다.
   - 브랜드-크리에이터 매칭 플랫폼 기능
   - 캠페인 관리 및 참여 기능
   - 소셜미디어 연동 기능 등
2. 회사는 서비스의 내용, 운영상 또는 기술상 필요에 따라 변경할 수 있으며, 변경 시 사전 고지합니다.

제 5 조 (회원 탈퇴 및 이용 제한)
1. 회원은 언제든지 서비스 내 설정 기능을 통해 탈퇴를 요청할 수 있습니다.
2. 회사는 회원이 다음 각 호의 사유에 해당하는 경우 사전 통보 없이 이용계약을 해지하거나 서비스 이용을 제한할 수 있습니다.
   - 타인의 정보 도용, 부정 사용
   - 서비스 운영을 고의로 방해하는 행위
   - 공공질서 및 미풍양속에 반하는 행위`},privacyCollection:{title:"개인정보 수집/이용동의",content:`제 1 조 (목적)
본 개인정보 처리방침은 리얼매치(이하 "회사")가 운영하는 인터넷 사이트 및 모바일 애플리케이션(이하 "서비스")과 관련하여, 정보주체의 개인정보 보호 및 권익을 보호하고 개인정보와 관련한 이용자의 고충을 원활하게 처리하기 위한 방침을 설명합니다.

제 2 조 (수집하는 개인정보 항목)
회사는 다음과 같은 항목의 개인정보를 수집할 수 있습니다.
- 이름, 나이, 성별
- 배송지 주소
- 소셜 로그인 계정 (카카오, 네이버 등)
- 소셜미디어 링크 (인스타그램 등)
- 서비스 이용 내역 (캠페인 참여 내역, 제안 수락/거절 이력 등)
- 광고성 정보 수신 채널 설정 정보 (앱 푸시, 이메일 수신 여부 등)

제 3 조 (개인정보의 수집 및 이용 목적)
회사는 수집한 개인정보를 다음 목적을 위해 활용합니다.
- 회원 가입 및 본인 인증
- 브랜드-크리에이터 매칭을 위한 정보 제공
- 캠페인 운영 및 정산 관련 업무
- 맞춤형 콘텐츠 및 광고 제공
- 고객 상담 및 문의 응대
- 마케팅 및 서비스 개선을 위한 통계 분석

제 4 조 (개인정보의 보유 및 이용기간)
1. 회원의 개인정보는 원칙적으로 회원 탈퇴 시 지체 없이 파기됩니다.
2. 단, 아래의 정보는 관계 법령에 따라 일정 기간 보관됩니다.
   - 계약 또는 청약철회 등에 관한 기록: 5년
   - 소비자의 불만 또는 분쟁처리에 관한 기록: 3년
   - 표시/광고에 관한 기록: 6개월

제 5 조 (개인정보의 제3자 제공)
회사는 회원의 동의 없이 개인정보를 외부에 제공하지 않습니다. 단, 다음의 경우는 예외로 합니다.
- 법령에 의거하거나 수사기관의 요청이 있는 경우
- 회원이 별도로 제3자 제공에 동의한 경우

제 6 조 (개인정보의 파기 절차 및 방법)
1. 개인정보는 수집 및 이용 목적이 달성된 후 내부 방침 및 관련 법령에 따라 즉시 파기됩니다.
2. 전자적 파일 형태는 복구 불가능한 방법으로, 종이 문서는 분쇄 또는 소각 등의 방법으로 파기합니다.

제 7 조 (이용자의 권리와 행사 방법)
회원은 언제든지 자신의 개인정보를 열람하거나 정정, 삭제, 처리정지를 요청할 수 있으며, ‘마이페이지’ 내 설정에서 직접 수정 또는 삭제 가능합니다.`},privacy3rdParty:{title:"개인정보 제3자 제공 동의",content:`1. 개인정보 제 3자 제공 동의

RealMatch는 서비스 제공을 위해 아래와 같이 개인정보를 제 3자에게 제공할 수 있습니다.

- 제공받는 자: 브랜드 파트너사 또는 협업 캠페인 참여 기업
- 제공 항목: 이름, 나이, 성별, 소셜미디어 링크, 서비스 이용 내역(캠페인 참여 이력 등)
- 제공 목적: 인플루언서-브랜드 간 매칭, 협업 제안, 캠페인 성사 및 운영
- 보유 및 이용 기간: 캠페인 종료일로부터 1년 또는 관련 법령에 따른 보존기간까지

이용자는 위 제공에 동의하지 않을 권리가 있으며, 다만 동의하지 않을 경우 일부 서비스 이용에 제한이 있을 수 있습니다.`},eventMarketing:{title:"이벤트 혜택 및 광고성 정보 수신 동의",content:`RealMatch는 이용자에게 더 나은 혜택과 정보를 제공하기 위해 아래와 같은 광고성 정보를 전송할 수 있습니다.

- 수신 항목: 이벤트 안내, 캠페인 추천, 신규 기능 알림 등
- 수신 채널: APP PUSH, 이메일
- 수신 주기: 주 1~2회 이내

이용자는 언제든지 설정 메뉴에서 수신 동의를 철회할 수 있습니다.`},privacyUsage:{title:"개인정보 이용 동의",content:`RealMatch는 다음과 같은 목적으로 개인정보를 이용합니다.

- 회원 관리: 본인 확인, 문의 응대, 공지사항 전달
- 서비스 제공: 매칭 검사 및 결과 제공, 캠페인 매칭, 사용자 맞춤형 콘텐츠 제공
- 통계 분석: 서비스 개선 및 신규 기능 개발을 위한 데이터 분석

수집되는 정보: 이름, 나이, 성별, 소셜로그인 계정, 소셜미디어 링크, 서비스 이용 내역 등`},emailPush:{title:"이메일/앱 푸시 수신 동의",content:`RealMatch는 이용자에게 중요 안내 및 알림을 전달하기 위해 이메일 및 앱 푸시를 통해 정보를 제공합니다.

- 수신 항목: 제안 도착 알림, 캠페인 성사 알림, 시스템 변경 및 업데이트 안내 등
- 수신 채널: 이메일, 앱 푸시 알림
- 수신 빈도: 필요 시 비정기적

이용자는 알림 설정을 통해 수신 여부를 자유롭게 변경할 수 있습니다.
`}},I={age14:!1,serviceTerms:!1,privacyCollection:!1,privacy3rdParty:!1,eventMarketing:!1,privacyUsage:!1,emailPush:!1};function D(){const s=T(),[i]=b(),r=i.get("provider"),n=3,{setTerms:l,setRole:o}=S();u.useEffect(()=>{(!r||!["kakao","naver","google"].includes(r))&&(console.error("Invalid or missing provider:",r),s("/auth/login"))},[r,s]);const[t,x]=u.useState(I),[m,g]=u.useState({isOpen:!1,title:"",content:""}),c=Object.values(t).every(Boolean),v=t.age14&&t.serviceTerms&&t.privacyCollection&&t.privacy3rdParty,k=a=>{x({age14:a,serviceTerms:a,privacyCollection:a,privacy3rdParty:a,eventMarketing:a,privacyUsage:a,emailPush:a})},d=a=>{x(h=>({...h,[a]:!h[a]}))},f=a=>{const h=L[a];h&&g({isOpen:!0,title:h.title,content:h.content})},N=()=>{if(v){const a=[{type:"AGE",agreed:t.age14},{type:"SERVICE_TERMS",agreed:t.serviceTerms},{type:"PRIVACY_COLLECTION",agreed:t.privacyCollection},{type:"PRIVACY_THIRD_PARTY",agreed:t.privacy3rdParty},{type:"MARKETING_PRIVACY_COLLECTION",agreed:t.eventMarketing},{type:"MARKETING_NOTIFICATION",agreed:t.emailPush}];l(a),o("CREATOR"),s(`/auth/signup/info?provider=${r}`)}};return e.jsxs("div",{className:"flex flex-col min-h-screen bg-grad-auth",children:[e.jsx(M,{currentStep:1,totalSteps:n}),e.jsxs("div",{className:"flex flex-col flex-1 px-6 py-6",children:[e.jsxs("div",{className:"flex-1",children:[e.jsx("h2",{className:"text-title text-text-black text-center mb-15",children:"약관에 동의해주세요"}),e.jsxs("div",{className:"w-full h-[52px] flex items-center gap-2 px-4 mb-6 rounded-xl bg-bg-w-80 cursor-pointer transition-colors",onClick:()=>k(!c),children:[e.jsx(C,{checked:c}),e.jsx("span",{className:"text-title1 text-text-black",children:"약관 전체 동의"})]}),e.jsx(R,{age14:t.age14,serviceTerms:t.serviceTerms,privacyCollection:t.privacyCollection,privacy3rdParty:t.privacy3rdParty,eventMarketing:t.eventMarketing,onAge14Change:()=>d("age14"),onServiceTermsChange:()=>d("serviceTerms"),onPrivacyCollectionChange:()=>d("privacyCollection"),onPrivacy3rdPartyChange:()=>d("privacy3rdParty"),onEventMarketingChange:()=>d("eventMarketing"),onDetailClick:f}),e.jsx("div",{className:"mt-4 px-12",children:e.jsx(A,{privacyUsage:t.privacyUsage,emailPush:t.emailPush,onPrivacyUsageChange:()=>d("privacyUsage"),onEmailPushChange:()=>d("emailPush"),onDetailClick:f})})]}),e.jsx(w,{type:"button",variant:"primary",size:"lg",fullWidth:!0,disabled:!v,onClick:N,className:v?"":"bg-core-1! text-white! cursor-not-allowed!",children:"다음"})]}),e.jsx(E,{isOpen:m.isOpen,onClose:()=>g(a=>({...a,isOpen:!1})),title:m.title,content:m.content})]})}const F=P(function(){return e.jsx(D,{})});export{F as default};
