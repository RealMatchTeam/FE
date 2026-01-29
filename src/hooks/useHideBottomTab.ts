import { useContext, useLayoutEffect } from "react";
import { LayoutContext } from "../routes/_main/layout-context";

/**
 * 바텀탭을 숨기는 커스텀 훅
 * 바텀시트가 열릴 때 바텀탭을 숨기고, 닫히거나 컴포넌트가 언마운트되면 복원
 * 
 * @param hide - true면 바텀탭 숨김, false면 표시
 */
export function useHideBottomTab(hide: boolean) {
  const layout = useContext(LayoutContext);

  useLayoutEffect(() => {
    if (!layout) return;
    
    layout.setHideBottomTab(hide);
    
    return () => {
      layout.setHideBottomTab(false);
    };
  }, [hide, layout]);
}
