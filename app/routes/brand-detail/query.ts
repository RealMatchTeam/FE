import { useQuery } from "@tanstack/react-query";
import type { BrandDomain } from "./types";
import { fetchBrandDetail } from "./api/api";

export function useBrandDetail(brandId: string, domain?: BrandDomain) {
  return useQuery({
    queryKey: ["brandDetail", brandId, domain],
    queryFn: () => fetchBrandDetail({ brandId, domain }),
    staleTime: 60_000,
    enabled: Boolean(brandId),
  });
}
