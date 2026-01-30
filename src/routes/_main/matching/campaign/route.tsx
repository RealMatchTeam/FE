import { createFileRoute } from '@tanstack/react-router'
import CampaignContent from './campaign-content'
import type { CampaignCategory } from '../../../../data/campaign'

type CampaignSearchParams = {
    type?: CampaignCategory
}

function CampaignRouteComponent() {
    const search = Route.useSearch()
    return <CampaignContent key={search.type} />
}

export const Route = createFileRoute('/_main/matching/campaign')({
    component: CampaignRouteComponent,
    validateSearch: (search: Record<string, unknown>): CampaignSearchParams => {
        const type = search.type as string | undefined
        if (type === 'BEAUTY' || type === 'FASHION') {
            return { type }
        }
        return { type: 'BEAUTY' }
    },
})
