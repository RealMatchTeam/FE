import { useMutation } from "@tanstack/react-query";
import { postCampaignRequest } from "../../routes/_main/_business/campaign/api/campaign";

export const useCreateCampaignMutation = () => {
  return useMutation({
    mutationFn: postCampaignRequest,
    onSuccess: (data) => {
      alert("캠페인 제안이 완료되었습니다!");
      console.log("성공:", data);
    },
    onError: (error) => {
      alert("제안에 실패했습니다.");
      console.error("에러:", error);
    },
  });
};