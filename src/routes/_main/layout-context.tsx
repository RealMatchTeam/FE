import { createContext } from "react";

type LayoutContextType = {
    hideBottomTab: boolean;
    setHideBottomTab: (v: boolean) => void;
    hideHeader: boolean;
    setHideHeader: (v: boolean) => void;
};

export const LayoutContext = createContext<LayoutContextType | null>(null);
