import { Link } from '@tanstack/react-router';

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

export default function Tabs({ tabs, activeTab, onTabChange, className = "" }: TabsProps) {
    return (
        <div className={`flex w-full bg-white border-b border-bluegray-2 shrink-0 ${className}`}>
            {tabs.map((tab) => {
                const isSelected = activeTab === tab.value;

                // Mode 1: Link-based Tab
                if (tab.path) {
                    return (
                        <Link
                            key={tab.value}
                            to={tab.path}
                            className="flex-1 select-none"
                            activeOptions={{ exact: false }}
                        >
                            {({ isActive }) => (
                                <div
                                    className={`py-4 text-title-1 text-center relative transition-colors cursor-pointer ${isActive ? 'text-core-1' : 'text-text-gray3'
                                        }`}
                                >
                                    {tab.label}
                                    {isActive && (
                                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120px] h-[2px] bg-core-1" />
                                    )}
                                </div>
                            )}
                        </Link>
                    );
                }

                // Mode 2: Button-based Tab (State)
                return (
                    <button
                        key={tab.value}
                        onClick={() => onTabChange?.(tab.value)}
                        className={`flex-1 py-4 text-title-1 text-center relative transition-colors select-none ${isSelected ? 'text-core-1' : 'text-text-gray3'
                            }`}
                    >
                        {tab.label}
                        {isSelected && (
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120px] h-[2px] bg-core-1" />
                        )}
                    </button>
                );
            })}
        </div>
    );
}
