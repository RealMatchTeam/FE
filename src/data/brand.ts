export type BrandCategory = "BEAUTY" | "FASHION";

export interface Brand {
    id: number;
    name: string;
    matchRate: number;
    tags: string[];
    isLiked: boolean;
    logoUrl?: string;
    category: BrandCategory;
}

export const BRAND_DATA: Brand[] = [
    // 뷰티 브랜드
    { id: 1, name: "라운드랩", matchRate: 99, tags: ["청정자극", "저자극", "심플한 감성"], isLiked: false, category: "BEAUTY" },
    { id: 2, name: "땡큐파머", matchRate: 89, tags: ["자연주의", "시간의 미학", "실용적"], isLiked: false, category: "BEAUTY" },
    { id: 3, name: "이즈앤트리", matchRate: 79, tags: ["클린 뷰티", "저자극", "성분 중심"], isLiked: true, category: "BEAUTY" },
    // 패션 브랜드
    { id: 4, name: "무신사 스탠다드", matchRate: 95, tags: ["미니멀", "베이직", "가성비"], isLiked: false, category: "FASHION" },
    { id: 5, name: "디스이즈네버댓", matchRate: 88, tags: ["스트릿", "캐주얼", "트렌디"], isLiked: true, category: "FASHION" },
    { id: 6, name: "커버낫", matchRate: 82, tags: ["아메리칸 캐주얼", "빈티지", "유니섹스"], isLiked: false, category: "FASHION" },
];
