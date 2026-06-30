import { View, type ViewProps } from 'react-native';

import { cn } from '@/lib/cn';
import { renderMixedChildren } from '@/lib/mixedChildren';

export function Label({ className, children, ...props }: ViewProps & { className?: string }) {
  return (
    <View className={cn('mb-1.5 flex-row items-center gap-1.5', className)} {...props}>
      {renderMixedChildren(children, 'text-sm font-medium text-[#243b5d] dark:text-zinc-300')}
    </View>
  );
}
