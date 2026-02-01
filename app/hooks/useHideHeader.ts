import { useContext, useLayoutEffect } from "react";
import { LayoutContext } from "../routes/layout-context";

export function useHideHeader(hide: boolean) {
  const layout = useContext(LayoutContext);

  useLayoutEffect(() => {
    if (!layout) return;

    layout.setHideHeader(hide);

    return () => {
      layout.setHideHeader(false);
    };
  }, [hide, layout]);
}
