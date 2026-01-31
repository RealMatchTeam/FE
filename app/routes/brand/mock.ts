import type { BrandDetailData } from "./types";

export const BRAND_DETAIL_MOCK: Record<string, BrandDetailData> = {
  // -------- beauty 3 --------
  beplain: {
    id: "beplain",
    domain: "beauty",
    name: "비플레인",
    matchRate: 98,
    heroImageUrl:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
    logoText: "beplain",
    hashtags: ["#저자극", "#천연보습", "#민감성피부"],
    description: "천연 유래 성분으로 민감 피부를 위한 저자극 스킨케어 브랜드",
    categories: ["스킨케어", "메이크업"],
    tagSections: [
      {
        title: "스킨케어 태그",
        groups: [
          { label: "피부타입", chips: ["건성", "지성", "복합성"] },
          { label: "주요 기능", chips: ["수분/보습", "진정"] },
        ],
      },
      {
        title: "메이크업 태그",
        groups: [
          { label: "피부 타입", chips: ["건성", "민감성"] },
          { label: "메이크업 스타일", chips: ["내추럴", "글로우"] },
        ],
      },
    ],
    ongoingCampaigns: [
      {
        id: "c1",
        brandName: "beplain",
        startAt: "7/10",
        ddayLabel: "D-DAY",
        matchRate: 98,
        descText: "신제품 체험단 모집",
        rewardText: "리워드 200,000원",
        isLiked: false,
      },
      {
        id: "c2",
        brandName: "beplain",
        startAt: "5/10",
        ddayLabel: "D-3",
        matchRate: 98,
        descText: "신제품 체험단 모집",
        rewardText: "리워드 200,000원",
        isLiked: true,
      },
      {
        id: "c3",
        brandName: "beplain",
        startAt: "4/1",
        ddayLabel: "D-5",
        matchRate: 98,
        descText: "신제품 체험단 모집",
        rewardText: "리워드 200,000원",
        isLiked: false,
      },
    ],
    products: [
      {
        id: "p1",
        title: "녹두 약산성 클렌징폼",
        imageUrl:
          "https://images.unsplash.com/photo-1585232351009-aa87416fca90?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "p2",
        title: "팔 콜라겐 팩투폼",
        imageUrl:
          "https://images.unsplash.com/photo-1611930022073-84f8f49f6f17?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "p3",
        title: "레몬씨 글루타치온 톤업 크림",
        imageUrl:
          "https://images.unsplash.com/photo-1612810436541-336d6f2f1fd3?auto=format&fit=crop&w=900&q=80",
      },
    ],
    histories: [
      {
        id: "h1",
        title: "‘녹두 세럼’ 체험단 모집",
        rightText: "1월 15일 진행예정",
        highlight: true,
      },
      {
        id: "h2",
        title: "‘녹두 토너’ 체험단 모집",
        rightText: "1월 25일 진행예정",
        highlight: true,
      },
      {
        id: "h3",
        title: "‘레몬씨 글루타치온 톤업 크림’",
        rightText: "12/15/24 완료",
      },
      {
        id: "h4",
        title: "‘녹두 약산성 클렌징젤’ 체험단 모집",
        rightText: "8/15/24 완료",
      },
    ],
  },

  isntree: {
    id: "isntree",
    domain: "beauty",
    name: "이즈앤트리",
    matchRate: 98,
    heroImageUrl:
      "https://images.unsplash.com/photo-1611930022073-84f8f49f6f17?auto=format&fit=crop&w=1200&q=80",
    logoText: "Isntree",
    hashtags: ["#클린뷰티", "#저자극", "#성분 중심"],
    description: "자연 유래 성분으로 피부의 힘을 키우는 비건 스킨케어 브랜드",
    categories: ["스킨케어"],
    tagSections: [
      {
        title: "스킨케어 태그",
        groups: [
          { label: "피부타입", chips: ["건성", "지성"] },
          { label: "주요 기능", chips: ["수분/보습", "트러블"] },
        ],
      },
    ],
    ongoingCampaigns: [
      {
        id: "c1",
        brandName: "Isntree",
        startAt: "8/10",
        ddayLabel: "D-DAY",
        matchRate: 98,
        descText: "어니언 뉴페어리 라인…",
        rewardText: "리워드 200,000원",
        isLiked: false,
      },
      {
        id: "c2",
        brandName: "Isntree",
        startAt: "6/10",
        ddayLabel: "D-3",
        matchRate: 98,
        descText: "초저분자 히알루론…",
        rewardText: "리워드 100,000원",
        isLiked: true,
      },
      {
        id: "c3",
        brandName: "Isntree",
        startAt: "3/1",
        ddayLabel: "D-5",
        matchRate: 98,
        descText: "하이알루론산 토너…",
        rewardText: "리워드 200,000원",
        isLiked: false,
      },
    ],
    products: [
      {
        id: "p1",
        title: "어니언 뉴페어리 젤",
        imageUrl:
          "https://images.unsplash.com/photo-1585232351009-aa87416fca90?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "p2",
        title: "초저분자 히알루론",
        imageUrl:
          "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "p3",
        title: "하이알루론산 토너",
        imageUrl:
          "https://images.unsplash.com/photo-1612810436541-336d6f2f1fd3?auto=format&fit=crop&w=900&q=80",
      },
    ],
    histories: [
      {
        id: "h1",
        title: "‘어니언 뉴페어리 세럼’ 체험단…",
        rightText: "1월 20일 진행예정",
        highlight: true,
      },
      {
        id: "h2",
        title: "‘어니언 뉴페어리 세럼’ 리뷰…",
        rightText: "1월 25일 진행예정",
        highlight: true,
      },
      {
        id: "h3",
        title: "‘초저분자 히알루론 크림’…",
        rightText: "12/15/24 완료",
      },
      {
        id: "h4",
        title: "‘하이알루론산 토너’ 체험단…",
        rightText: "8/15/24 완료",
      },
    ],
  },

  roundlab: {
    id: "roundlab",
    domain: "beauty",
    name: "라운드랩",
    matchRate: 98,
    heroImageUrl:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
    logoText: "ROUND LAB",
    hashtags: ["#정착템", "#저자극", "#심플한감성"],
    description: "정직한 자연 성분으로 안심하고 쓸 수 있는 클린 뷰티 브랜드",
    categories: ["스킨케어"],
    tagSections: [
      {
        title: "스킨케어 태그",
        groups: [
          { label: "피부타입", chips: ["건성", "민감성"] },
          { label: "주요 기능", chips: ["수분/보습", "미백"] },
        ],
      },
    ],
    ongoingCampaigns: [
      {
        id: "c1",
        brandName: "ROUND LAB",
        startAt: "9/10",
        ddayLabel: "D-DAY",
        matchRate: 98,
        descText: "베스트 라인 체험단",
        rewardText: "리워드 100,000원",
        isLiked: false,
      },
      {
        id: "c2",
        brandName: "ROUND LAB",
        startAt: "4/5",
        ddayLabel: "D-3",
        matchRate: 98,
        descText: "진정 라인 체험단",
        rewardText: "리워드 100,000원",
        isLiked: true,
      },
      {
        id: "c3",
        brandName: "ROUND LAB",
        startAt: "4/1",
        ddayLabel: "D-5",
        matchRate: 98,
        descText: "수분 라인 체험단",
        rewardText: "리워드 100,000원",
        isLiked: false,
      },
    ],
    products: [
      {
        id: "p1",
        title: "비타 나이아신",
        imageUrl:
          "https://images.unsplash.com/photo-1585232351009-aa87416fca90?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "p2",
        title: "자작나무 수분",
        imageUrl:
          "https://images.unsplash.com/photo-1611930022073-84f8f49f6f17?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "p3",
        title: "1025 독도 토너",
        imageUrl:
          "https://images.unsplash.com/photo-1612810436541-336d6f2f1fd3?auto=format&fit=crop&w=900&q=80",
      },
    ],
    histories: [
      {
        id: "h1",
        title: "‘비타 나이아신 글로우’ 체험단…",
        rightText: "1월 25일 진행예정",
        highlight: true,
      },
      {
        id: "h2",
        title: "‘자작나무 수분’ 더블…",
        rightText: "1월 25일 진행예정",
        highlight: true,
      },
      {
        id: "h3",
        title: "‘1025 독도 토너’ 체험단…",
        rightText: "12/15/24 완료",
      },
      {
        id: "h4",
        title: "‘1025 독도 토너’ 체험단…",
        rightText: "8/15/24 완료",
      },
    ],
  },

  // -------- fashion 3 --------
  graceu: {
    id: "graceu",
    domain: "fashion",
    name: "그레이스유",
    matchRate: 98,
    heroImageUrl:
      "https://images.unsplash.com/photo-1520975958225-2b9d35f2f6f3?auto=format&fit=crop&w=1200&q=80",
    logoText: "GRACE U",
    hashtags: ["#데일리스", "#클래식", "#우아함"],
    description: "전체를 실루엣과 고급 소재로 완성하는 미니멀 여성복 브랜드",
    categories: ["의류"],
    tagSections: [
      {
        title: "의류 태그",
        groups: [
          { label: "브랜드 종류", chips: ["디자이너 브랜드"] },
          { label: "브랜드 스타일", chips: ["페미닌", "미니멀"] },
        ],
      },
    ],
    ongoingCampaigns: [
      {
        id: "c1",
        brandName: "GRACE U",
        startAt: "10/10",
        ddayLabel: "D-DAY",
        matchRate: 98,
        descText: "가을 신상 체험단",
        rewardText: "리워드 300,000원",
        isLiked: false,
      },
      {
        id: "c2",
        brandName: "GRACE U",
        startAt: "4/5",
        ddayLabel: "D-3",
        matchRate: 98,
        descText: "니트 라인 체험단",
        rewardText: "리워드 300,000원",
        isLiked: true,
      },
      {
        id: "c3",
        brandName: "GRACE U",
        startAt: "8/1",
        ddayLabel: "D-5",
        matchRate: 98,
        descText: "원피스 라인 체험단",
        rewardText: "리워드 300,000원",
        isLiked: false,
      },
    ],
    products: [
      {
        id: "p1",
        title: "Lucy Tie Jacket",
        imageUrl:
          "https://images.unsplash.com/photo-1520975958225-2b9d35f2f6f3?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "p2",
        title: "Lavina Knit Cardigan",
        imageUrl:
          "https://images.unsplash.com/photo-1520975867597-0df1b0d1f24f?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "p3",
        title: "Anais Off-shoulder",
        imageUrl:
          "https://images.unsplash.com/photo-1520975682071-4f3f909cc053?auto=format&fit=crop&w=900&q=80",
      },
    ],
    histories: [
      {
        id: "h1",
        title: "Lucy Tie Cardigan 리뷰…",
        rightText: "1월 15일 진행예정",
        highlight: true,
      },
      {
        id: "h2",
        title: "Lucy Tie Shirt 리뷰 테스트…",
        rightText: "2월 25일 진행예정",
        highlight: true,
      },
      {
        id: "h3",
        title: "Lavina Knit Shirt 체험단…",
        rightText: "12/15/24 완료",
      },
      {
        id: "h4",
        title: "Anais Knit Skirt 체험단…",
        rightText: "10/15/24 완료",
      },
    ],
  },

  thetis: {
    id: "thetis",
    domain: "fashion",
    name: "더티스",
    matchRate: 88,
    heroImageUrl:
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1200&q=80",
    logoText: "TheTis",
    hashtags: ["#러블리", "#트렌디", "#더티스_중심"],
    description: "유니크한 디자이너 스토리로 무드를 담은 감각적인 패션 브랜드",
    categories: ["의류"],
    tagSections: [
      {
        title: "의류 태그",
        groups: [
          { label: "브랜드 종류", chips: ["디자이너 브랜드"] },
          { label: "브랜드 스타일", chips: ["페미닌", "러블리"] },
        ],
      },
    ],
    ongoingCampaigns: [
      {
        id: "c1",
        brandName: "TheTis",
        startAt: "9/10",
        ddayLabel: "D-DAY",
        matchRate: 88,
        descText: "TEDDY HOOD 체험단",
        rewardText: "리워드 250,000원",
        isLiked: false,
      },
      {
        id: "c2",
        brandName: "TheTis",
        startAt: "7/10",
        ddayLabel: "D-3",
        matchRate: 88,
        descText: "ANGEL CABLE 체험단",
        rewardText: "리워드 250,000원",
        isLiked: true,
      },
      {
        id: "c3",
        brandName: "TheTis",
        startAt: "6/1",
        ddayLabel: "D-5",
        matchRate: 88,
        descText: "BOUQUET 체험단",
        rewardText: "리워드 250,000원",
        isLiked: false,
      },
    ],
    products: [
      {
        id: "p1",
        title: "TEDDY HOOD…",
        imageUrl:
          "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "p2",
        title: "ANGEL CABL…",
        imageUrl:
          "https://images.unsplash.com/photo-1520975867597-0df1b0d1f24f?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "p3",
        title: "BOUQUET L…",
        imageUrl:
          "https://images.unsplash.com/photo-1520975682071-4f3f909cc053?auto=format&fit=crop&w=900&q=80",
      },
    ],
    histories: [
      {
        id: "h1",
        title: "‘TEDDY HOOD FUR COA…",
        rightText: "1월 15일 진행예정",
        highlight: true,
      },
      {
        id: "h2",
        title: "‘ANGEL CABLE SKIRT’ 체…",
        rightText: "2월 25일 진행예정",
        highlight: true,
      },
      { id: "h3", title: "‘BOUQUET LAYERED SHI…", rightText: "12/15/24 완료" },
      { id: "h4", title: "‘BOUQUET LAYERED PA…", rightText: "8/15/24 완료" },
    ],
  },

  glowny: {
    id: "glowny",
    domain: "fashion",
    name: "글로니",
    matchRate: 78,
    heroImageUrl:
      "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1200&q=80",
    logoText: "GLOWNY",
    hashtags: ["#클래식", "#편안함", "#러블리"],
    description: "클래식한 실루엣에 트렌드를 더한 문턱 낮은 패션 브랜드",
    categories: ["의류"],
    tagSections: [
      {
        title: "의류 태그",
        groups: [
          { label: "브랜드 종류", chips: ["디자이너 브랜드", "중가 브랜드"] },
          { label: "브랜드 스타일", chips: ["러블리", "캐주얼"] },
        ],
      },
    ],
    ongoingCampaigns: [
      {
        id: "c1",
        brandName: "GLOWNY",
        startAt: "9/10",
        ddayLabel: "D-DAY",
        matchRate: 78,
        descText: "WILD TUBE TOP 체험단",
        rewardText: "리워드 400,000원",
        isLiked: false,
      },
      {
        id: "c2",
        brandName: "GLOWNY",
        startAt: "8/10",
        ddayLabel: "D-3",
        matchRate: 78,
        descText: "SUGAR PUFF…",
        rewardText: "리워드 400,000원",
        isLiked: true,
      },
      {
        id: "c3",
        brandName: "GLOWNY",
        startAt: "5/1",
        ddayLabel: "D-5",
        matchRate: 78,
        descText: "PEEKABOO…",
        rewardText: "리워드 400,000원",
        isLiked: false,
      },
    ],
    products: [
      {
        id: "p1",
        title: "WILD TUBE T…",
        imageUrl:
          "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "p2",
        title: "SUGAR PUFF …",
        imageUrl:
          "https://images.unsplash.com/photo-1520975867597-0df1b0d1f24f?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "p3",
        title: "PEEKABOO …",
        imageUrl:
          "https://images.unsplash.com/photo-1520975682071-4f3f909cc053?auto=format&fit=crop&w=900&q=80",
      },
    ],
    histories: [
      {
        id: "h1",
        title: "‘WILD TUBE PANTS’ 체험…",
        rightText: "1월 15일 진행예정",
        highlight: true,
      },
      {
        id: "h2",
        title: "‘WILD TUBE SKIRT’ 체험…",
        rightText: "3월 25일 진행예정",
        highlight: true,
      },
      { id: "h3", title: "‘SUGAR PUFF SHIRT’ 리…", rightText: "12/15/24 완료" },
      { id: "h4", title: "‘SUGAR PUFF SHIRT’ 리…", rightText: "7/15/24 완료" },
    ],
  },
};

export function getBrandDetailMock(brandId: string): BrandDetailData {
  return BRAND_DETAIL_MOCK[brandId] ?? BRAND_DETAIL_MOCK.beplain;
}
