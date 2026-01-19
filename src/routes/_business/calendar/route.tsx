import { createFileRoute } from "@tanstack/react-router";
import CalendarContent from "./calendar-content";

export const Route = createFileRoute("/_business/calendar")({
    component: CalendarContent,
});
