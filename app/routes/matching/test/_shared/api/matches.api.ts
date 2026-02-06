import { axiosInstance } from "../../../../../api/axios";
import type { ApiResponse } from "../types/matches.types";
import type {
  MatchesRequest,
  MatchesResponseResult,
} from "../types/matches.types";

export async function postMatches(
  payload: MatchesRequest,
): Promise<ApiResponse<MatchesResponseResult>> {
  const res = await axiosInstance.post<ApiResponse<MatchesResponseResult>>(
    "v1/matches",
    payload,
  );

  // 통신 자체는 성공했는데 서버가 실패 플래그 준 케이스
  if (!res.data.isSuccess) {
    throw new Error(res.data.message || "매칭 요청 실패");
  }

  return res.data;
}
