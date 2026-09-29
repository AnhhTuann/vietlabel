import React from 'react';
import { cn } from '../../lib/utils';

interface SectionTitleProps {
  kicker?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  dark?: boolean;
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  kicker,
  title,
  subtitle,
  align = 'center',
  dark = false,
  className,
}) => {
  return (
    <div
      className={cn(
        'mb-12 max-w-3xl',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className
      )}
    >
      {kicker && (
        <span
          className={cn(
            'inline-block text-xs font-semibold tracking-wider uppercase mb-2.5',
            dark ? 'text-amber-400' : 'text-[#E8531D]'
          )}
        >
          {kicker}
        </span>
      )}
      <h2
        className={cn(
          'text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight [text-wrap:balance] leading-[1.25]',
          dark ? 'text-white' : 'text-[#0B2A4A]'
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            'mt-3.5 text-base sm:text-lg leading-relaxed [text-wrap:balance]',
            dark ? 'text-slate-300' : 'text-slate-600'
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
