import { createFileRoute } from '@tanstack/react-router'
import MyPage from './mypage-content'

export const Route = createFileRoute('/_main/_mypage/mypage')({
  component: MyPageLayout,
})

function MyPageLayout() {
  return (
    <>
      <MyPage />
    </>
  );
}