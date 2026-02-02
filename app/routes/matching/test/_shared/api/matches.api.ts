import { axiosInstance } from "../../../../../api/axios";
import type {
  ApiResponse,
  MatchesRequest,
  MatchesResponseResult,
} from "../types/matches.types";

export async function postMatches(
  payload: MatchesRequest,
): Promise<ApiResponse<MatchesResponseResult>> {
  const res = await axiosInstance.post<ApiResponse<MatchesResponseResult>>(
    "/api/v1/matches",
    payload,
  );
  return res.data;
}
