import { z } from "zod";

export const campaignFormSchema = z.object({
  campaignName: z
    .string()
    .min(1, "캠페인명을 입력해주세요")
    .max(30, "캠페인명은 30자 이내로 입력해주세요"),
  description: z
    .string()
    .min(1, "설명을 입력해주세요")
    .max(300, "설명은 300자 이내로 입력해주세요"),
  format: z.array(z.string()).min(1, "형식을 선택해주세요"),
  category: z.array(z.string()).min(1, "종류를 선택해주세요"),
  tone: z.array(z.string()).min(1, "톤을 선택해주세요"),
  involvement: z.array(z.string()).min(1, "관여도를 선택해주세요"),
  usageScope: z.array(z.string()).min(1, "활용 범위를 선택해주세요"),
  sponsorProduct: z.array(z.string()).min(1, "협찬품을 선택해주세요"),
  fee: z
    .string()
    .min(1, "원고료를 입력해주세요")
    .refine(
      (val) => {
        const num = Number(val);
        return num <= 10000000;
      },
      { message: "원고료는 1,000만원 이하로 입력해주세요" }
    ),
  startDate: z.string().min(1, "시작 날짜를 선택해주세요"),
  endDate: z.string().min(1, "끝 날짜를 선택해주세요"),
});

export type CampaignFormData = z.infer<typeof campaignFormSchema>;

export const defaultCampaignFormValues: CampaignFormData = {
  campaignName: "",
  description: "",
  format: [],
  category: [],
  tone: [],
  involvement: [],
  usageScope: [],
  sponsorProduct: [],
  fee: "",
  startDate: "",
  endDate: "",
};
