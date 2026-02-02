import { useQuery } from "@tanstack/react-query";
import {
  fetchBeautyTags,
  fetchFashionTags,
  fetchContentTags,
} from "./tags.api";

export function useBeautyTags() {
  return useQuery({
    queryKey: ["tags", "beauty"],
    queryFn: fetchBeautyTags,
    staleTime: 1000 * 60 * 10,
  });
}

export function useFashionTags() {
  return useQuery({
    queryKey: ["tags", "fashion"],
    queryFn: fetchFashionTags,
    staleTime: 1000 * 60 * 10,
  });
}

export function useContentTags() {
  return useQuery({
    queryKey: ["tags", "content"],
    queryFn: fetchContentTags,
    staleTime: 1000 * 60 * 10,
  });
}
