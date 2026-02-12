import { create } from "zustand";

export interface RecruitingCampaignItem {
  campaignId: number;
  brandName: string;
  title: string;
  recruitQuota: number;
  rewardAmount: number;
  imageUrl?: string;
  dday: number;
  like?: boolean;
}

export interface CampaignProposalData {
  brandId: number;
  campaignId?: number;
  domain: string;
  brandName?: string;
  campaignTitle?: string;
  campaignDescription?: string;
  rewardAmount?: number;
  product?: string;
  productId?: number;
  products?: { id: string; name: string }[];
  startDate?: string;
  endDate?: string;
  contentTags?: {
    formats?: { name: string; id?: number }[];
    categories?: { name: string; id?: number }[];
    tones?: { name: string; id?: number }[];
    involvements?: { name: string; id?: number }[];
    usageRanges?: { name: string; id?: number }[];
  };
  proposalId?: number;
}

type CampaignProposalStore = {
  proposalData: CampaignProposalData | null;
  setProposalData: (data: CampaignProposalData) => void;
  clearProposalData: () => void;

  // 브랜드 상세에서 조회한 모집중 캠페인 목록
  recruitingCampaigns: RecruitingCampaignItem[];
  setRecruitingCampaigns: (campaigns: RecruitingCampaignItem[]) => void;

  // 사용자 프로필 정보
  snsAccount: string | null;
  setSnsAccount: (account: string) => void;
};

export const useCampaignProposalStore = create<CampaignProposalStore>((set) => ({
  proposalData: null,
  setProposalData: (data) => set({ proposalData: data }),
  clearProposalData: () => set({ proposalData: null }),

  recruitingCampaigns: [],
  setRecruitingCampaigns: (campaigns) => set({ recruitingCampaigns: campaigns }),

  snsAccount: null,
  setSnsAccount: (account) => set({ snsAccount: account }),
}));
