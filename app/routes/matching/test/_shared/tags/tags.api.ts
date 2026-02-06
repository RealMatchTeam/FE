import { axiosInstance } from "../../../../../api/axios";
import type { ApiResponse } from "../types/matches.types";
import type { BeautyTags, FashionTags, ContentTags } from "./tags.types";

export async function fetchBeautyTags(): Promise<BeautyTags> {
  const res = await axiosInstance.get<ApiResponse<BeautyTags>>("/v1/tags/beauty");
  if (!res.data.isSuccess) {
    throw new Error(res.data.message || "beauty 태그 조회 실패");
  }
  return res.data.result;
}

export async function fetchFashionTags(): Promise<FashionTags> {
  const res = await axiosInstance.get<ApiResponse<FashionTags>>("/v1/tags/fashion");
  if (!res.data.isSuccess) {
    throw new Error(res.data.message || "fashion 태그 조회 실패");
  }
  return res.data.result;
}

export async function fetchContentTags(): Promise<ContentTags> {
  const res = await axiosInstance.get<ApiResponse<ContentTags>>("/v1/tags/content");
  if (!res.data.isSuccess) {
    throw new Error(res.data.message || "content 태그 조회 실패");
  }
  return res.data.result;
}
