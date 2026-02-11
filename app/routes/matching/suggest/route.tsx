import { Outlet } from "react-router";
import { useContext, useEffect } from "react";
import { LayoutContext } from "../../layout-context";
import MatchingHeader from "../components/MatchingHeader";

export default function MatchingSuggestLayout() {
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
      <MatchingHeader title="제안하기" />
      <Outlet />
    </div>
  );
}
