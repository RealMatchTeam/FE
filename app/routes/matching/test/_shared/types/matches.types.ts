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
    heightTags: number;
    weightTypeTags: number;
    topSizeTags: number;
    bottomSizeTags: number;
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

export type MatchesResponseResult = unknown;
