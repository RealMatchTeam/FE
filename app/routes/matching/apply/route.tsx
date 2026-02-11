import { Outlet } from "react-router";
import { useContext, useEffect } from "react";
import { LayoutContext } from "../../layout-context";
import MatchingHeader from "../components/MatchingHeader";

export default function MatchingApplyLayout() {
    const layout = useContext(LayoutContext);

    useEffect(() => {
        if (!layout) return;
        layout.setHideHeader(true);
        layout.setHideBottomTab(true);

        return () => {
            layout.setHideHeader(false);
            layout.setHideBottomTab(false);
        };
    }, [layout]);

    return (
        <div className="flex flex-col h-screen bg-white">
            <MatchingHeader title="지원하기" />
            <main className="flex-1 flex flex-col overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}
