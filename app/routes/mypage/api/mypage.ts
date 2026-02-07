import { axiosInstance } from "../../../api/axios";

export type MyPageResponseDto = {
  nickname?: string;
  name?: string;
  email?: string;
  profileImageUrl?: string | null;
  hasMatchingTest?: boolean;
};

type CustomResponseMyPageResponseDto = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: MyPageResponseDto;
};

export const getMyPage = async (): Promise<MyPageResponseDto> => {
  const response = await axiosInstance.get<CustomResponseMyPageResponseDto>(
    "/api/v1/users/me",
  );

  if (!response.data.isSuccess) {
    throw new Error(response.data.message || "마이페이지 정보 조회 실패");
  }

  return response.data.result;
};
