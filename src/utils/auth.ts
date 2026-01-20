// ============================================
// 닉네임 관련 유틸
// ============================================

/** 닉네임 중복 확인 (임시 구현) */
export const checkNicknameAvailability = async (nickname: string): Promise<{
  available: boolean;
  message: string;
}> => {
  // TODO: 실제 API 호출로 대체
  if (!nickname.trim()) {
    return { available: false, message: "" };
  }
  
  // 임시로 "비비킹"이면 중복 처리
  if (nickname === "비비킹") {
    return { available: false, message: "*이미 존재하는 닉네임입니다" };
  }
  
  return { available: true, message: "*사용 가능한 닉네임입니다" };
};

// ============================================
// 이메일 인증 관련 유틸
// ============================================

/** 이메일 인증 코드 전송 */
export const sendVerificationEmail = async (email: string): Promise<boolean> => {
  // TODO: 실제 API 호출로 대체
  if (!email.trim()) {
    return false;
  }
  
  // 임시로 항상 성공 반환
  return true;
};

/** 인증 코드 검증 */
export const verifyEmailCode = (code: string): {
  valid: boolean;
  message: string;
} => {
  if (code.length !== 6) {
    return { valid: false, message: "" };
  }
  
  // 임시로 "G12346"이면 성공 처리
  if (code === "G12346") {
    return { valid: true, message: "" };
  }
  
  return { valid: false, message: "*인증코드가 올바르지 않습니다" };
};

// ============================================
// 비밀번호 관련 유틸
// ============================================

/** 비밀번호 유효성 검사 규칙 */
const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*[\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,20}$/;

/** 비밀번호 유효성 검사 */
export const validatePassword = (password: string): {
  valid: boolean;
  message: string;
} => {
  if (!password) {
    return { valid: false, message: "" };
  }
  
  if (password.length < 8 || password.length > 20) {
    return { valid: false, message: "*8-20자리로 입력해주세요" };
  }
  
  if (!PASSWORD_REGEX.test(password)) {
    return { valid: false, message: "*영문, 숫자, 특수문자 중 2종류 이상 조합해주세요" };
  }
  
  return { valid: true, message: "" };
};

/** 비밀번호 일치 확인 */
export const checkPasswordMatch = (password: string, confirmPassword: string): {
  match: boolean;
  message: string;
} => {
  if (!confirmPassword) {
    return { match: false, message: "" };
  }
  
  if (password !== confirmPassword) {
    return { match: false, message: "*비밀번호가 같지 않습니다" };
  }
  
  return { match: true, message: "" };
};

// ============================================
// 약관 동의 관련 유틸
// ============================================

/** 필수 약관 체크 여부 확인 */
export const checkRequiredAgreements = (agreements: {
  age14: boolean;
  serviceTerms: boolean;
  privacyCollection: boolean;
  privacy3rdParty: boolean;
}): boolean => {
  return (
    agreements.age14 &&
    agreements.serviceTerms &&
    agreements.privacyCollection &&
    agreements.privacy3rdParty
  );
};
