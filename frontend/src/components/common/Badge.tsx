import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
}

export default function Badge({ children, variant = 'primary', size = 'sm' }: BadgeProps) {
  const variants = {
    primary: 'bg-[oklch(93.6%_0.032_17.717)] text-[oklch(50.5%_0.213_27.518)]',
    secondary: 'bg-[oklch(93.7%_0.013_255.508)] text-[oklch(47.6%_0.049_257.281)]',
    success: 'bg-[oklch(96.2%_0.044_156.743)] text-[oklch(52.7%_0.154_150.069)]',
    warning: 'bg-[oklch(96.2%_0.059_95.617)] text-[oklch(55.5%_0.163_48.998)]',
    error: 'bg-[oklch(93.6%_0.032_17.717)] text-[oklch(50.5%_0.213_27.518)]',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
}
