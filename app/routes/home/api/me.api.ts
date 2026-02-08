import { apiClient } from "../../../api/axios";
import type { MeFeatureResponse } from "../types";

export const getMeFeature = async () => {
  const res = await apiClient.get<MeFeatureResponse>(
    "/api/v1/users/me/feature",
  );
  return res.data;
};
