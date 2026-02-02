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
