export interface Brand {
    id: number;
    name: string;
    matchRate: number;
    tags: string[];
    isLiked: boolean;
    logoUrl?: string;
}

export const BRAND_DATA: Brand[] = [
    { id: 1, name: "라운드랩", matchRate: 99, tags: ["청정자극", "저자극", "심플한 감성"], isLiked: false },
    { id: 2, name: "땡큐파머", matchRate: 89, tags: ["자연주의", "시간의 미학", "실용적"], isLiked: false },
    { id: 3, name: "이즈앤트리", matchRate: 79, tags: ["클린 뷰티", "저자극", "성분 중심"], isLiked: true },
];
