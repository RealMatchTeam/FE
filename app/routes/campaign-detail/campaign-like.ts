import { apiClient } from "../../api/axios";

type ApiResponse<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
};

function coerceToBooleanLike(result: unknown): boolean | null {
  if (typeof result === "boolean") return result;

  if (typeof result === "string") {
    const v = result.trim().toLowerCase();
    if (v === "true") return true;
    if (v === "false") return false;
    if (v === "liked") return true;
    if (v === "unliked") return false;
    if (v === "on") return true;
    if (v === "off") return false;
    return null;
  }

  return null;
}

export async function toggleCampaignLike(
  campaignId: number,
): Promise<boolean | null> {
  const res = await apiClient.post<ApiResponse<unknown>>(
    `/api/v1/campaigns/${campaignId}/like`,
  );

  if (!res.data?.isSuccess) {
    throw new Error(res.data?.message || "캠페인 좋아요에 실패했어요.");
  }

  return coerceToBooleanLike(res.data.result);
}
