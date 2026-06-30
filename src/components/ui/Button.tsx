import { ActivityIndicator, Pressable, type PressableProps } from 'react-native';

import { cn } from '@/lib/cn';
import { renderMixedChildren } from '@/lib/mixedChildren';

type Variant = 'default' | 'outline' | 'ghost' | 'destructive';
type Size = 'default' | 'sm' | 'icon';

interface ButtonProps extends Omit<PressableProps, 'children'> {
  variant?: Variant;
  size?: Size;
  className?: string;
  textClassName?: string;
  loading?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  default: 'bg-[#1f3c68] active:bg-[#163056]',
  outline: 'border border-[#1f3c68] bg-transparent active:bg-[#1f3c68]/10',
  ghost: 'bg-transparent active:bg-black/5 dark:active:bg-white/10',
  destructive: 'bg-red-600 active:bg-red-700',
};

const variantTextClasses: Record<Variant, string> = {
  default: 'text-white',
  outline: 'text-[#1f3c68] dark:text-blue-300',
  ghost: 'text-[#1f3c68] dark:text-blue-300',
  destructive: 'text-white',
};

const sizeClasses: Record<Size, string> = {
  default: 'h-12 px-5',
  sm: 'h-9 px-3',
  icon: 'h-10 w-10',
};

export function Button({
  variant = 'default',
  size = 'default',
  className,
  textClassName,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      disabled={isDisabled}
      className={cn(
        'flex-row items-center justify-center gap-2 rounded-xl',
        sizeClasses[size],
        variantClasses[variant],
        isDisabled && 'opacity-50',
        className
      )}
      {...props}>
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === 'default' || variant === 'destructive' ? '#ffffff' : '#1f3c68'}
        />
      )}
      {renderMixedChildren(children, cn('text-sm font-semibold', variantTextClasses[variant], textClassName))}
    </Pressable>
  );
}
