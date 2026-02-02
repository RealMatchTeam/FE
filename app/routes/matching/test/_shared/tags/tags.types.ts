export type TagItem = {
  id: number;
  name: string;
};

export type BeautyTags = {
  tagType: string;
  categories: Record<string, TagItem[]>;
};

export type FashionTags = {
  tagType: string;
  categories: Record<string, TagItem[]>;
};

export type ContentTags = {
  viewerGenders: TagItem[];
  viewerAges: TagItem[];
  avgVideoLengths: TagItem[];
  avgVideoViews: TagItem[];

  formats: TagItem[];
  categories: TagItem[];
  tones: TagItem[];
  involvements: TagItem[];
  usageRanges: TagItem[];
};
