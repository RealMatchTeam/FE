// updatedAt을 "25.01.06", "14:00" 형태로 만들기
// (updatedAt이 ISO 문자열이라고 가정)

export function formatKoreanDateTime(updatedAt: string) {
  const d = new Date(updatedAt);

  const yy = String(d.getFullYear()).slice(2);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");

  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");

  return {
    dateText: `${yy}.${mm}.${dd}`,
    timeText: `${hh}:${min}`,
  };
}

