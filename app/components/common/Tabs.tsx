import { NavLink, useLocation } from 'react-router';
import { useLayoutEffect, useRef, useState } from 'react';

export interface TabItem {
    label: string;
    value: string;
    path?: string;
}

interface TabsProps {
    tabs: TabItem[];
    activeTab?: string;
    onTabChange?: (value: string) => void;
    className?: string;
}

const SIDE_MARGIN_PX = 16;

export default function Tabs({ tabs, activeTab, onTabChange, className = "" }: TabsProps) {
    const location = useLocation();
    const hasPath = tabs.some((t) => t.path);
    const currentActiveTab = hasPath
        ? tabs.find((t) => t.path && location.pathname.startsWith(t.path))?.value || tabs[0]?.value
        : activeTab;

    const activeIndex = Math.max(
        0,
        tabs.findIndex((t) => t.value === currentActiveTab)
    );

    const wrapRef = useRef<HTMLDivElement | null>(null);
    const [wrapWidth, setWrapWidth] = useState(0);

    useLayoutEffect(() => {
        const el = wrapRef.current;
        if (!el) return;

        const measure = () => setWrapWidth(el.clientWidth);
        measure();

        const ro = new ResizeObserver(() => measure());
        ro.observe(el);

        return () => ro.disconnect();
    }, []);

    const pxToRem = (px: number) => {
        if (typeof window === "undefined") return `${px / 16}rem`;
        const root = window.getComputedStyle(document.documentElement).fontSize;
        const base = Number.parseFloat(root) || 16;
        return `${px / base}rem`;
    };

    const trackWidth = Math.max(0, wrapWidth - SIDE_MARGIN_PX * 2);
    const tabWidth = trackWidth / tabs.length;
    const indicatorWidth = tabWidth;
    const indicatorX = SIDE_MARGIN_PX + tabWidth * activeIndex;

    return (
        <div ref={wrapRef} className={`relative w-full h-12.5 bg-white shrink-0 ${className}`}>
            <div className="flex h-full items-center px-4">
                {tabs.map((tab) => {
                    const isSelected = currentActiveTab === tab.value;

                    // Link-based Tab
                    if (tab.path) {
                        return (
                            <NavLink
                                key={tab.value}
                                to={tab.path}
                                className="flex-1 select-none"
                            >
                                {({ isActive }) => (
                                    <div
                                        className={`h-full flex items-center justify-center text-title2 transition-colors cursor-pointer ${isActive ? 'text-(--color-core-1)' : 'text-text-gray3'
                                            }`}
                                    >
                                        {tab.label}
                                    </div>
                                )}
                            </NavLink>
                        );
                    }

                    // Button-based Tab
                    return (
                        <button
                            key={tab.value}
                            type="button"
                            onClick={() => onTabChange?.(tab.value)}
                            className={`flex-1 h-full flex items-center justify-center text-title2 transition-colors ${isSelected ? 'text-(--color-core-1)' : 'text-text-gray3'
                                }`}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-px bg-black/10" />

            <div
                className="absolute bottom-0 h-0.5 bg-(--color-success) transition-transform duration-200"
                style={{
                    width: pxToRem(indicatorWidth),
                    transform: `translateX(${pxToRem(indicatorX)})`,
                }}
            />
        </div>
    );
}
