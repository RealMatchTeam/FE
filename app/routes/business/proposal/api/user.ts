import { axiosInstance } from "../../../../api/axios"; 

export interface ProfileCard {
  nickname: string;
  profileImageUrl: string;
  gender: string;
  age: number;
  snsAccount: string;
  contentCategories: string[];
  matchingResult: {
    creatorType: string;
  };
}

// 프로필 카드 정보를 가져오는 함수 정의
export const getProfileCard = async (): Promise<ProfileCard> => {
  try {
    const response = await axiosInstance.get(`/v1/users/me/profile-card`);

    if (response.data && response.data.isSuccess) {
      return response.data.result; 
    }

    throw new Error(response.data.message || "프로필 카드 로드 실패");
  } catch (error) {
    console.error("프로필 카드 조회 실패:", error);
    throw error; 
  }
};