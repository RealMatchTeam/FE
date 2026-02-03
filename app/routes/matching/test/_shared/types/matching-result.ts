export type ApiResponse<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
};

export type Brand = {
  brandId: number;
  brandName: string;
  logoUrl?: string;
  matchingRatio: number;
};

export type MatchingResultApi = {
  userType: string;
  typeTag: string[];
  highMatchingBrandList: {
    count: number;
    brands: Brand[];
  };
};
