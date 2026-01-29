import { createFileRoute } from '@tanstack/react-router'
import MyPage from './mypage-content'

export const Route = createFileRoute('/_main/mypage')({
  component: MyPage,
})
