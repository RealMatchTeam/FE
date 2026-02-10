import { create } from "zustand";

export interface CampaignProposalData {
  brandId: number;
  campaignId: number;
  domain: string;
  brandName?: string;
  campaignTitle?: string;
  campaignDescription?: string;
  rewardAmount?: number;
  product?: string;
  startDate?: string;
  endDate?: string;
  contentTags?: {
    formats?: { name: string; id?: number }[];
    categories?: { name: string; id?: number }[];
    tones?: { name: string; id?: number }[];
    involvements?: { name: string; id?: number }[];
    usageRanges?: { name: string; id?: number }[];
  };
}

type CampaignProposalStore = {
  proposalData: CampaignProposalData | null;
  setProposalData: (data: CampaignProposalData) => void;
  clearProposalData: () => void;

  // 사용자 프로필 정보
  snsAccount: string | null;
  setSnsAccount: (account: string) => void;
};

export const useCampaignProposalStore = create<CampaignProposalStore>((set) => ({
  proposalData: null,
  setProposalData: (data) => set({ proposalData: data }),
  clearProposalData: () => set({ proposalData: null }),

  snsAccount: null,
  setSnsAccount: (account) => set({ snsAccount: account }),
}));
