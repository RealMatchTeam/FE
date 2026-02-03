// src/routes/_home/home.mock.ts
import type { HomeAfterMatchResponse } from "./types";

export const HOME_AFTER_MATCH_MOCK: HomeAfterMatchResponse = {
  beauty: {
    category: "beauty",
    hero: [
      {
        id: "b-hero-1",
        imageUrl: "https://picsum.photos/900/600?1",
        alt: "beauty hero 1",
      },
      {
        id: "b-hero-2",
        imageUrl: "https://picsum.photos/900/600?2",
        alt: "beauty hero 2",
      },
      {
        id: "b-hero-3",
        imageUrl: "https://picsum.photos/900/600?3",
        alt: "beauty hero 3",
      },
    ],

    topBrands: [
      {
        id: "b-brand-1",
        domain: "beauty",
        name: "beplain",
        matchRate: 98,
        isLiked: true,
        subText: "#비건 #천연재료",
        badgeText: "모집중",
      },
      {
        id: "b-brand-2",
        domain: "beauty",
        name: "isntree",
        matchRate: 95,
        subText: "#저자극 #클린뷰티",
        badgeText: "모집중",
      },
      {
        id: "b-brand-3",
        domain: "beauty",
        name: "manyo",
        matchRate: 92,
        subText: "#순한성분 #클린뷰티",
        badgeText: "모집중",
      },
    ],

    topCampaigns: [
      {
        id: "b-camp-1",
        brandName: "beplain",
        startAt: "7/10",
        ddayLabel: "D-DAY",
        matchRate: 98,
        descText: "신제품 릴스 홍보",
        rewardText: "원고료 200,000원",
      },
      {
        id: "b-camp-2",
        brandName: "isntree",
        startAt: "1/5",
        ddayLabel: "D-7",
        matchRate: 98,
        isLiked: true,
        descText: "신제품 체험단 모집",
        rewardText: "원고료 200,000원",
      },
      {
        id: "b-camp-3",
        brandName: "manyo",
        startAt: "7/10",
        ddayLabel: "D-3",
        matchRate: 92,
        descText: "신제품 릴스 홍보",
        rewardText: "원고료 200,000원",
      },
    ],

    creatorProfile: {
      creatorName: "크리에이터 님",
      creatorType: "creator",
      summary: "OO한 크리에이터",
      highlightBrandText: "OO한 브랜드",
      traits: {
        beauty: "OO 뷰티 특성",
        fashion: "OO 패션 특성",
        content: "OO 콘텐츠 특성",
      },
    },

    popularCampaigns: [
      {
        id: "b-pop-1",
        brandName: "beplain",
        ddayLabel: "D-DAY",
        progressText: "7/10",
        descText: "신제품 릴스 홍보",
        rewardText: "원고료 200,000원",
      },
      {
        id: "b-pop-2",
        brandName: "isntree",
        ddayLabel: "D-7",
        progressText: "1/5",
        descText: "신제품 체험단 모집",
        rewardText: "원고료 200,000원",
      },
      {
        id: "b-pop-3",
        brandName: "manyo",
        ddayLabel: "D-3",
        progressText: "7/10",
        descText: "신제품 릴스 홍보",
        rewardText: "원고료 200,000원",
      },
    ],
  },

  fashion: {
    category: "fashion",
    hero: [
      {
        id: "f-hero-1",
        imageUrl: "https://picsum.photos/900/600?4",
        alt: "fashion hero 1",
      },
      {
        id: "f-hero-2",
        imageUrl: "https://picsum.photos/900/600?5",
        alt: "fashion hero 2",
      },
      {
        id: "f-hero-3",
        imageUrl: "https://picsum.photos/900/600?6",
        alt: "fashion hero 3",
      },
    ],

    topBrands: [
      {
        id: "f-brand-1",
        domain: "fashion",
        name: "GRACE U",
        matchRate: 98,
        subText: "#타임리스 #클래식",
        badgeText: "모집중",
      },
      {
        id: "f-brand-2",
        domain: "fashion",
        name: "Thetis",
        matchRate: 95,
        isLiked: true,
        subText: "#러블리 #트렌디",
        badgeText: "모집중",
      },
      {
        id: "f-brand-3",
        domain: "fashion",
        name: "GLOWNY",
        matchRate: 92,
        subText: "#클린걸 #편안함",
        badgeText: "모집중",
      },
    ],

    topCampaigns: [
      {
        id: "f-camp-1",
        brandName: "Thetis",
        startAt: "7/10",
        ddayLabel: "D-DAY",
        matchRate: 96,
        descText: "신제품 릴스 홍보",
        rewardText: "원고료 100,000원",
      },
      {
        id: "f-camp-2",
        brandName: "GRACE U",
        startAt: "1/5",
        ddayLabel: "D-7",
        matchRate: 93,
        descText: "신제품 체험단 모집",
        rewardText: "원고료 300,000원",
      },
      {
        id: "f-camp-3",
        brandName: "GLOWNY",
        startAt: "7/10",
        ddayLabel: "D-3",
        matchRate: 91,
        descText: "신제품 릴스 홍보",
        rewardText: "원고료 200,000원",
      },
    ],

    creatorProfile: {
      creatorName: "크리에이터 님",
      creatorType: "creator",
      summary: "OO한 크리에이터",
      highlightBrandText: "OO한 브랜드",
      traits: {
        beauty: "OO 뷰티 특성",
        fashion: "OO 패션 특성",
        content: "OO 콘텐츠 특성",
      },
    },

    popularCampaigns: [
      {
        id: "f-pop-1",
        brandName: "GRACE U",
        ddayLabel: "D-DAY",
        progressText: "7/10",
        descText: "신제품 릴스 홍보",
        rewardText: "원고료 300,000원",
      },
      {
        id: "f-pop-2",
        brandName: "Thetis",
        ddayLabel: "D-7",
        progressText: "1/5",
        descText: "신제품 체험단 모집",
        rewardText: "원고료 100,000원",
      },
      {
        id: "f-pop-3",
        brandName: "GLOWNY",
        ddayLabel: "D-3",
        progressText: "7/10",
        descText: "신제품 릴스 홍보",
        rewardText: "원고료 200,000원",
      },
    ],
  },
};
