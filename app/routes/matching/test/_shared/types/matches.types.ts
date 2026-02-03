export type ApiResponse<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
};

export type MatchesRequest = {
  beauty: {
    interestStyleTags: number[];
    prefferedFunctionTags: number[];
    skinTypeTags: number;
    skinToneTags: number;
    makeupStyleTags: number;
  };
  fashion: {
    interestStyleTags: number[];
    preferredItemTags: number[];
    preferredBrandTags: number[];
    heightTag: number;
    weightTypeTag: number;
    topSizeTag: number;
    bottomSizeTag: number;
  };
  content: {
    sns: {
      url: string;
      mainAudience: {
        genderTags: number[];
        ageTags: number[];
      };
      averageAudience: {
        videoLengthTags: number[];
        videoViewsTags: number[];
      };
    };
    typeTags: number[];
    toneTags: number[];
    prefferedInvolvementTags: number[];
    prefferedCoverageTags: number[];
  };
};

export type MatchedBrand = {
  brandId: number;
  brandName: string;
  matchingRatio: number;
  logoUrl?: string;
};

export type HighMatchingBrandList = {
  count: number;
  brands: MatchedBrand[];
};

export type MatchesResponseResult = {
  userName: string;
  userType: string;
  typeTag: string[];
  highMatchingBrandList: HighMatchingBrandList;
};
