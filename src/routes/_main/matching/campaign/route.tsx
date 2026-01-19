import { createFileRoute } from '@tanstack/react-router'
import CampaignContent from './campaign-content'

export const Route = createFileRoute('/_main/matching/campaign')({
    component: CampaignContent,
})
