export type ApiResponse<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
};

export type TagId = number | string;

export type TagItem = {
  id: TagId;
  name: string;
};

// /api/v1/tags/beauty, /api/v1/tags/fashion
export type CategoryTagMap = Record<string, TagItem[]>;

export type BeautyFashionTagsResult = {
  tagType: string;
  categories: CategoryTagMap;
};

// /api/v1/tags/content
export type ContentTagsResult = {
  formats: TagItem[];
  categories: TagItem[];
  tones: TagItem[];
  involvements: TagItem[];
  usageRanges: TagItem[];
};
