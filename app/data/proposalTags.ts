export interface ProposalTag {
  id: number;
  name: string;
}

export interface ProposalTagGroup {
  sort: string;
  sortKorName: string;
  tags: ProposalTag[];
}

export const PROPOSAL_TAGS: ProposalTagGroup[] = [
  {
    sort: "FORMAT",
    sortKorName: "형식",
    tags: [
      { id: 1, name: "인스타 스토리" },
      { id: 2, name: "인스타 포스트" },
      { id: 3, name: "인스타 릴스" },
      { id: 4, name: "기타" },
    ],
  },
  {
    sort: "CATEGORY",
    sortKorName: "종류",
    tags: [
      { id: 5, name: "브이로그" },
      { id: 6, name: "리뷰" },
      { id: 7, name: "겟레디윗미" },
      { id: 8, name: "비포&애프터" },
      { id: 9, name: "스토리/썰" },
      { id: 10, name: "챌린지" },
      { id: 11, name: "기타" },
    ],
  },
  {
    sort: "TONE",
    sortKorName: "톤",
    tags: [
      { id: 12, name: "전문적인" },
      { id: 13, name: "감성적인" },
      { id: 14, name: "유쾌/재밌는" },
      { id: 15, name: "트렌디한" },
      { id: 16, name: "일상적인" },
      { id: 17, name: "수다적인" },
      { id: 18, name: "기타" },
    ],
  },
  {
    sort: "INVOLVEMENT",
    sortKorName: "관여도",
    tags: [
      { id: 19, name: "관여안함" },
      { id: 20, name: "가이드만 제공" },
      { id: 21, name: "대본 일부 제공" },
      { id: 22, name: "모든 연출 관여" },
      { id: 23, name: "기타" },
    ],
  },
  {
    sort: "USAGE_RANGE",
    sortKorName: "활용 범위",
    tags: [
      { id: 24, name: "크리에이터 1차활용" },
      { id: 25, name: "브랜드 2차활용" },
      { id: 26, name: "기타" },
    ],
  },
];

const findGroup = (sort: string) =>
  PROPOSAL_TAGS.find((g) => g.sort === sort)!;

export const FORMAT_TAGS = findGroup("FORMAT").tags;
export const CATEGORY_TAGS = findGroup("CATEGORY").tags;
export const TONE_TAGS = findGroup("TONE").tags;
export const INVOLVEMENT_TAGS = findGroup("INVOLVEMENT").tags;
export const USAGE_RANGE_TAGS = findGroup("USAGE_RANGE").tags;

/** name → id 매핑 (전체) */
export const PROPOSAL_TAG_ID_BY_NAME: Record<string, number> =
  PROPOSAL_TAGS.flatMap((g) => g.tags).reduce(
    (acc, t) => ({ ...acc, [t.name]: t.id }),
    {} as Record<string, number>,
  );
