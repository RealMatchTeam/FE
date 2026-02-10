import { parseISO, startOfDay, isWithinInterval, format } from "date-fns";
// 1. 'import type'을 사용하고, 실제로 사용하지 않는다면 에러 방지를 위해 주석 처리하거나 제거합니다.
import type { ProposalDetail, AppliedCampaignDetail } from "../routes/business/proposal/api/proposal";

/**
 * 1. MATCHED 상태인지 확인하는 공통 함수
 */
export const isMatched = (status: string): boolean => status === "MATCHED";

/**
 * 2. 특정 날짜(오늘 등)가 캠페인 기간 내에 있는지 확인
 */
export const isDateInCampaignRange = (
  startDate: string | null, 
  endDate: string | null, 
  targetDate: Date = new Date()
) => {
  if (!startDate || !endDate) return false;
  
  try {
    const start = startOfDay(parseISO(startDate));
    const end = startOfDay(parseISO(endDate));
    const target = startOfDay(targetDate);
    
    // date-fns의 interval 체크
    return isWithinInterval(target, { start, end });
  } catch (error) {
    console.error("날짜 계산 오류:", error);
    return false;
  }
};

/**
 * 3. 이번 달에 걸쳐있는 일정인지 확인 (캘린더용)
 * 시작일이나 종료일이 이번 달이거나, 혹은 이번 달을 아예 관통하는 일정인지 확인
 */
export const isEventInCurrentMonth = (
  startDate: string | null, 
  endDate: string | null, 
  viewDate: Date
) => {
  if (!startDate || !endDate) return false;
  
  const currentMonthStr = format(viewDate, "yyyy-MM");
  
  // 간단한 문자열 비교 (YYYY-MM 형식)
  const isStartThisMonth = startDate.startsWith(currentMonthStr);
  const isEndThisMonth = endDate.startsWith(currentMonthStr);
  
  // 시작일이 이전 달이고 종료일이 다음 달인 '걸친 일정'도 고려하려면 아래 조건이 필요할 수 있습니다.
  return isStartThisMonth || isEndThisMonth;
};

/**
 * 4. (참고) 타입을 사용하는 예시를 추가하면 unused 에러가 사라집니다.
 * 필요 없다면 이 함수는 지우셔도 됩니다.
 */
export const getCampaignTitle = (item: ProposalDetail | AppliedCampaignDetail): string => {
  if ('title' in item) return item.title;
  if ('campaignTitle' in item) return item.campaignTitle;
  return "제목 없음";
};