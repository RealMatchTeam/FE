import { createFileRoute, Outlet } from '@tanstack/react-router'
import Tabs from '../../../components/common/Tabs'

export const Route = createFileRoute('/_main/matching')({
    component: MatchingLayout,
})

const MATCHING_TABS = [
    { label: '브랜드', value: 'brand', path: '/matching/brand' },
    { label: '캠페인', value: 'campaign', path: '/matching/campaign' }
];

function MatchingLayout() {
    return (
        <div className="flex flex-col w-full h-full bg-white">
            {/* Top Tab Navigation */}
            <Tabs tabs={MATCHING_TABS} />

            <div className="flex-1">
                <Outlet />
            </div>
        </div>
    )
}
