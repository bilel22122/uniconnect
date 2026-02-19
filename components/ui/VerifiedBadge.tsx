import { BadgeCheck } from 'lucide-react';

interface VerifiedBadgeProps {
    className?: string;
    size?: number;
}

export default function VerifiedBadge({ className = "", size = 20 }: VerifiedBadgeProps) {
    return (
        <span
            className={`inline-flex items-center ml-2 ${className}`}
            title="Verified User"
        >
            <BadgeCheck
                size={size}
                className="text-secondary fill-secondary/10"
                strokeWidth={1.5}
            />
        </span>
    );
}
