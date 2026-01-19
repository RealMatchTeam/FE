import { createFileRoute } from '@tanstack/react-router'
import BrandContent from './brand-content'
import type { BrandCategory } from '../../../../data/brand'

type BrandSearchParams = {
    type?: BrandCategory
}

export const Route = createFileRoute('/_main/matching/brand')({
    component: BrandContent,
    validateSearch: (search: Record<string, unknown>): BrandSearchParams => {
        const type = search.type as string | undefined
        if (type === 'BEAUTY' || type === 'FASHION') {
            return { type }
        }
        return { type: 'BEAUTY' }
    },
})
