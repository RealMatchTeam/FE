import beautyIcon from "../../../../assets/beauty-icon.svg";
import fashionIcon from "../../../../assets/fashion-icon.svg";
import contentIcon from "../../../../assets/content-icon.svg";

type Trait = {
  id: "beauty" | "fashion" | "content";
  badge: string;
  icon: (className?: string) => React.ReactNode;
  previewLines: { label: string; value: string }[];
  topSummary: { label: string; value: string }[];
  sections: { title: string; items: string[] }[];
};

export const TRAITS: Trait[] = [
  {
    id: "beauty",
    badge: "뷰티 특성",
    icon: (className = "") => (
      <img src={beautyIcon} alt="beauty" className={className} />
    ),
    previewLines: [
      { label: "피부 타입", value: "건성, 민감성" },
      { label: "피부 밝기", value: "17~21호" },
      { label: "메이크업 \n스타일", value: "내추럴, 글로우" },
    ],
    topSummary: [
      { label: "피부타입", value: "건성, 민감성" },
      { label: "피부 밝기", value: "17~21호" },
      { label: "메이크업 스타일", value: "내추럴, 글로우" },
    ],
    sections: [
      {
        title: "관심 카테고리",
        items: ["스킨케어", "메이크업", "향수", "바디", "헤어"],
      },
      {
        title: "관심 기능",
        items: ["수분 / 보습", "진정", "미백", "안티에이징"],
      },
    ],
  },
  {
    id: "fashion",
    badge: "패션 특성",
    icon: (className = "") => (
      <img src={fashionIcon} alt="fashion" className={className} />
    ),
    previewLines: [
      { label: "키", value: "165cm" },
      { label: "체형", value: "웨이브" },
      { label: "상의", value: "S" },
      { label: "하의", value: "33 inch" },
    ],
    topSummary: [
      { label: "키/몸무게", value: "165cm" },
      { label: "체형", value: "웨이브" },
      { label: "상의 사이즈", value: "S" },
      { label: "하의 사이즈", value: "30" },
    ],
    sections: [
      {
        title: "관심 분야",
        items: ["33 inch"],
      },
      {
        title: "관심 스타일",
        items: ["캐주얼", "미니멀", "비즈니스 캐주얼"],
      },
      {
        title: "관심 브랜드",
        items: ["디자이너 브랜드", "빈티지", "SPA"],
      },
    ],
  },
  {
    id: "content",
    badge: "향수 특성",
    icon: (className = "") => (
      <img src={contentIcon} alt="content" className={className} />
    ),
    previewLines: [
      { label: "성별", value: "우디, 머스크" },
      { label: "나이대", value: "미들" },
      { label: "평균 길이", value: "차분, 깨끗" },
      { label: "평균 조회수", value: "1~10만회" },
    ],
    topSummary: [
      { label: "주 시청자 성별", value: "우디, 머스크" },
      { label: "주 시청자 나이대", value: "미들" },
      { label: "평균 영상 길이", value: "차분, 깨끗" },
      { label: "평균 조회수", value: "차분, 깨끗" },
    ],
    sections: [
      {
        title: "콘텐츠 형식",
        items: ["시더우드", "머스크", "샌달우드"],
      },
      {
        title: "브랜드 톤",
        items: ["데일리", "저녁", "특별한 날"],
      },
      {
        title: "희망 관여도",
        items: ["데일리", "저녁", "특별한 날"],
      },
      {
        title: "희망 활용 범위",
        items: ["데일리", "저녁", "특별한 날"],
      },
    ],
  },
];