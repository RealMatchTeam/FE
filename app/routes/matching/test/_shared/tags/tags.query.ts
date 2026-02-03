import { useQuery } from "@tanstack/react-query";
import {
  fetchBeautyTags,
  fetchFashionTags,
  fetchContentTags,
} from "./tags.api";
import type { BeautyTags, FashionTags, ContentTags } from "./tags.types";

const STALE = 1000 * 60 * 10;

export function useBeautyTags() {
  return useQuery<BeautyTags, Error>({
    queryKey: ["tags", "beauty"],
    queryFn: fetchBeautyTags,
    staleTime: STALE,
  });
}

export function useFashionTags() {
  return useQuery<FashionTags, Error>({
    queryKey: ["tags", "fashion"],
    queryFn: fetchFashionTags,
    staleTime: STALE,
  });
}
export function useContentTags() {
  return useQuery<ContentTags, Error>({
    queryKey: ["tags", "content"],
    queryFn: fetchContentTags,
    staleTime: STALE,
  });
}
