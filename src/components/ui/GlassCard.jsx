import { useMemo } from 'react';

export default function GlassCard({
  children,
  className = '',
  hover = true,
  padding = true,
  as: Tag = 'div',
  ...props
}) {
  const classes = useMemo(() => {
    const base = [
      'rounded-2xl',
      'backdrop-blur-xl bg-gray-900/70',
      'border border-gray-700/30',
      'shadow-lg shadow-black/20',
      'transition-all duration-200',
      padding && 'p-5 md:p-6',
      hover && 'hover:shadow-xl hover:bg-gray-900/80 hover:border-gray-700/50',
      'focus-visible:outline-2 focus-visible:outline-brand-400',
    ];
    return [...base, className].filter(Boolean).join(' ');
  }, [className, hover, padding]);

  return (
    <Tag className={classes} {...props}>
      {children}
    </Tag>
  );
}
