import Button from "../../../../components/common/Button";

export default function StartMatchingTestButton() {
  return (
    <Button variant="primary" size="lg" fullWidth withLogo to="/matching/test/step1">
      매칭률 검사하기
    </Button>
  );
}
