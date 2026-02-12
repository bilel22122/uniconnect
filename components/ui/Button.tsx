import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

export default function Button({
    variant = 'default',
    size = 'md',
    className = '',
    children,
    ...props
}: ButtonProps) {

    const baseStyles = "inline-flex items-center justify-center rounded-2xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-lg hover:-translate-y-0.5",
        outline: "border-2 border-slate-200 bg-white hover:border-primary hover:text-primary hover:shadow-lg hover:-translate-y-0.5",
        ghost: "hover:bg-slate-100 text-slate-700",
    };

    const sizes = {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-8 py-2 text-base",
        lg: "h-14 px-8 text-lg",
    };

    const combinedClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

    return (
        <button className={combinedClasses} {...props}>
            {children}
        </button>
    );
}
