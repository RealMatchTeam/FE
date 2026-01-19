import { createFileRoute } from '@tanstack/react-router'
import BrandContent from './brand-content'

export const Route = createFileRoute('/_main/matching/brand')({
    component: BrandContent,
})
