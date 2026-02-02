import { axiosInstance } from "../../../../../api/axios";
import type {
  ApiResponse,
  BeautyFashionTagsResult,
  ContentTagsResult,
} from "./tags.types";

export async function fetchBeautyTags(): Promise<BeautyFashionTagsResult> {
  const res = await axiosInstance.get<ApiResponse<BeautyFashionTagsResult>>(
    "/api/v1/tags/beauty",
  );
  if (!res.data.isSuccess)
    throw new Error(res.data.message || "beauty 태그 조회 실패");
  return res.data.result;
}

export async function fetchFashionTags(): Promise<BeautyFashionTagsResult> {
  const res = await axiosInstance.get<ApiResponse<BeautyFashionTagsResult>>(
    "/api/v1/tags/fashion",
  );
  if (!res.data.isSuccess)
    throw new Error(res.data.message || "fashion 태그 조회 실패");
  return res.data.result;
}

export async function fetchContentTags(): Promise<ContentTagsResult> {
  const res = await axiosInstance.get<ApiResponse<ContentTagsResult>>(
    "/api/v1/tags/content",
  );
  if (!res.data.isSuccess)
    throw new Error(res.data.message || "content 태그 조회 실패");
  return res.data.result;
}
