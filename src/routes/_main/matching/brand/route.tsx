import { createFileRoute } from '@tanstack/react-router'
import BrandContent from './brand-content'
import type { BrandCategory } from '../../../../data/brand'

type BrandSearchParams = {
    type?: BrandCategory
}

function BrandRouteComponent() {
    const search = Route.useSearch()
    return <BrandContent key={search.type} />
}

export const Route = createFileRoute('/_main/matching/brand')({
    component: BrandRouteComponent,
    validateSearch: (search: Record<string, unknown>): BrandSearchParams => {
        const type = search.type as string | undefined
        if (type === 'BEAUTY' || type === 'FASHION') {
            return { type }
        }
        return { type: 'BEAUTY' }
    },
})
