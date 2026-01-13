import type { InputHTMLAttributes, ReactNode } from "react";

// ============================================
// 공통 타입
// ============================================

/** 폼 공통 Props (닫기, 다음 핸들러) */
export interface FormProps {
  onClose: () => void;
  onNext: () => void;
}

// ============================================
// 컴포넌트 Props 타입
// ============================================

/** AuthHeader 컴포넌트 Props */
export interface AuthHeaderProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
}

/** ProgressBar 컴포넌트 Props */
export interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

/** SelectCard 컴포넌트 Props */
export interface SelectCardProps {
  icon: ReactNode;
  label: string;
  selected?: boolean;
  onClick: () => void;
}

/** Checkbox 컴포넌트 Props */
export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  required?: boolean;
  hasArrow?: boolean;
}

/** InputField 컴포넌트 Props */
export interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

/** SelectButton 컴포넌트 Props */
export interface SelectButtonProps {
  options: string[];
  value: string | null;
  onChange: (value: string) => void;
}

// ============================================
// 회원가입 폼 관련 타입
// ============================================

/** 약관 동의 상태 */
export interface AgreementState {
  allAgree: boolean;
  age14: boolean;
  serviceTerms: boolean;
  privacyCollection: boolean;
  privacy3rdParty: boolean;
  eventMarketing: boolean;
}

/** 기본 정보 입력 상태 (Step 2) */
export interface BasicInfoState {
  name: string;
  nickname: string;
  nicknameChecked: boolean;
  nicknameAvailable: boolean;
  email: string;
  emailVerified: boolean;
  password: string;
  passwordConfirm: string;
}
