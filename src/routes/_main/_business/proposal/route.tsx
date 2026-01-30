import { createFileRoute } from '@tanstack/react-router'
import ProposalContent from "./sent-proposal-content";
import ReceivedProposalContent from "./received-proposal-content";

// 쿼리 파라미터 타입 정의
type ProposalSearch = {
  type: 'sent' | 'received'
}

export const Route = createFileRoute('/_main/_business/proposal')({
  // validateSearch를 통해 쿼리 파라미터를 검증하고 타입 안정성을 확보합니다.
  validateSearch: (search: Record<string, unknown>): ProposalSearch => {
    return {
      type: (search.type as 'sent' | 'received') || 'sent', // 기본값은 'sent'
    }
  },
  component: ProposalComponent,
})

function ProposalComponent() {
  const { type } = Route.useSearch();

  // type 값에 따라 다른 컨텐츠를 보여줍니다.
  if (type === 'received') {
    return <ReceivedProposalContent />;
  }

  return <ProposalContent />;
}