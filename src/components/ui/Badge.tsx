import { View, type ViewProps } from 'react-native';

import { cn } from '@/lib/cn';
import { renderMixedChildren } from '@/lib/mixedChildren';

interface BadgeProps extends ViewProps {
  className?: string;
  textClassName?: string;
}

export function Badge({ className, textClassName, children, ...props }: BadgeProps) {
  return (
    <View
      className={cn('flex-row items-center gap-1.5 self-start rounded-full bg-gray-900 px-3 py-1', className)}
      {...props}>
      {renderMixedChildren(children, cn('text-xs font-semibold text-white', textClassName))}
    </View>
  );
}
