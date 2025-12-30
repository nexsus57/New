
import type { ComponentType, ReactNode } from "react";

interface StatCardProps {
    icon: ComponentType<{ className?: string }>;
    title: string;
    value: string | number;
    children?: ReactNode;
}

const StatCard = ({ icon: Icon, title, value, children }: StatCardProps) => {
    return (
        <div className="bg-admin-card p-6 rounded-lg shadow-md flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-admin-text-light uppercase tracking-wider">{title}</p>
                <p className="text-3xl font-bold text-admin-text">{value}</p>
                {children}
            </div>
            <div className="bg-admin-accent text-white rounded-full p-4">
                <Icon className="h-8 w-8" />
            </div>
        </div>
    );
}

export default StatCard;
