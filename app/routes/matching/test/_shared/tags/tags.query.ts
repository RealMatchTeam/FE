import { useQuery } from "@tanstack/react-query";
import { fetchBeautyTags } from "./tags.api";
import type { BeautyTags } from "./tags.types";

export function useBeautyTags() {
  return useQuery<BeautyTags, Error>({
    queryKey: ["tags", "beauty"],
    queryFn: fetchBeautyTags,
    staleTime: 1000 * 60 * 10,
  });
}
export function useFashionTags() {
  return useQuery<FashionTags, Error>({
    queryKey: ["tags", "fashion"],
    queryFn: fetchFashionTags,
    staleTime: STALE,
  });
}
