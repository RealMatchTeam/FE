// 브랜드 정렬 옵션
export const SORT_OPTIONS = ["매칭률 순", "인기 순", "신규 순"] as const;
export type SortOption = typeof SORT_OPTIONS[number];

// 캠페인 정렬 옵션
export const CAMPAIGN_SORT_OPTIONS = ["매칭률 순", "인기 순", "금액 순", "마감 순"] as const;
export type CampaignSortOption = typeof CAMPAIGN_SORT_OPTIONS[number];

// 뷰티 필터 카테고리
export const BEAUTY_FILTER = {
    카테고리: ["스킨케어", "메이크업", "향수", "바디", "헤어"],
    기능: ["트러블", "수분/보습", "진정", "미백", "안티에이징", "각질/모공"],
    피부타입: ["건성", "지성", "복합성", "민감성"],
    "메이크업 스타일": ["내추럴", "화려한", "글로우", "매트"],
} as const;

export type BeautyFilterKey = keyof typeof BEAUTY_FILTER;

// 패션 필터 카테고리
export const FASHION_FILTER = {
    카테고리: ["의류", "가방", "신발", "쥬얼리", "패션소품"],
    "브랜드 종류": ["SPA", "빈티지", "중가 브랜드", "디자이너 브랜드", "명품 브랜드"],
    스타일: ["미니멀", "페미닌", "러블리", "비즈니스 캐주얼", "캐주얼", "스트릿"],
} as const;

export type FashionFilterKey = keyof typeof FASHION_FILTER;

// 콘텐츠 필터 카테고리
export const CONTENT_FILTER = {
    형식: ["인스타 스토리", "인스타 포스트", "인스타 릴스"],
    종류: ["브이로그", "리뷰", "겟레디윗미", "비포&애프터", "스토리&썰", "챌린지"],
    톤: ["전문적인", "감성적인", "유쾌/재밌는", "블로그"],
    관여도: ["관여 안함", "가이드만 제공", "대본 일부 제공", "모든 연출 관여"],
    "활용 범위": ["크리에이터 1차 활용", "브랜드 2차 활용"],
} as const;

export type ContentFilterKey = keyof typeof CONTENT_FILTER;
