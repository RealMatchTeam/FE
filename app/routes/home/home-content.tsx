import EmptyMatchState from "../../components/common/EmptyMatchState";

export default function HomeContent() {
  return (
    <EmptyMatchState
      message={`매칭된 기업이 없어요\n매칭 검사를 먼저 진행해주세요`}
      showButton
    />
  );
}
