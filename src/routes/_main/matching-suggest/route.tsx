import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useContext, useEffect } from "react";
import { LayoutContext } from "../layout-context";
import SuggestHeader from "./components/SuggestHeader";

export const Route = createFileRoute("/_main/matching-suggest")({
  component: MatchingSuggestLayout,
});

function MatchingSuggestLayout() {
  const layout = useContext(LayoutContext);

  useEffect(() => {
    if (!layout) return;
    layout.setHideHeader(true);

    return () => {
      layout.setHideHeader(false);
    };
  }, [layout]);

  return (
    <div className="flex flex-col h-full bg-white">
      <SuggestHeader title="제안 하기" />
      <Outlet />
    </div>
  );
}
