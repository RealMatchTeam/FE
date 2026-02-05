import type { BrandItem, CampaignItem, CreatorProfileModel } from "./creator.ts";

export type CategoryKey = "beauty" | "fashion";

export interface HeroItem {
    id: string;
    imageUrl: string;
    alt: string;
}

export interface HomeAfterMatchCategoryData {
    category: CategoryKey;
    hero: HeroItem[];
    topBrands: BrandItem[];
    topCampaigns: CampaignItem[];
    creatorProfile: CreatorProfileModel;
    popularCampaigns: CampaignItem[];
}

export interface HomeAfterMatchResponse {
    beauty: HomeAfterMatchCategoryData;
    fashion: HomeAfterMatchCategoryData;
}
