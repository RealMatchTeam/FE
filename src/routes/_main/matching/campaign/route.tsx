import { createFileRoute } from '@tanstack/react-router'
import CampaignContent from './campaign-content'
import type { CampaignCategory } from '../../../../data/campaign'

type CampaignSearchParams = {
    type?: CampaignCategory
}

export const Route = createFileRoute('/_main/matching/campaign')({
    component: CampaignContent,
    validateSearch: (search: Record<string, unknown>): CampaignSearchParams => {
        const type = search.type as string | undefined
        if (type === 'BEAUTY' || type === 'FASHION') {
            return { type }
        }
        return { type: 'BEAUTY' }
    },
})
