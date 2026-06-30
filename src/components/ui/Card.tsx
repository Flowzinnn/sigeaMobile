import { Text, View, type TextProps, type ViewProps } from 'react-native';

import { cn } from '@/lib/cn';
import { renderMixedChildren } from '@/lib/mixedChildren';

export function Card({ className, style, ...props }: ViewProps & { className?: string }) {
  return (
    <View
      className={cn('rounded-xl bg-white dark:bg-zinc-900', className)}
      style={[{ elevation: 3, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } }, style]}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: ViewProps & { className?: string }) {
  return <View className={cn('p-6 pb-3', className)} {...props} />;
}

export function CardTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <View className="flex-row items-center gap-2">
      {renderMixedChildren(children, cn('text-lg font-semibold text-gray-900 dark:text-zinc-100', className))}
    </View>
  );
}

export function CardDescription({ className, ...props }: TextProps & { className?: string }) {
  return <Text className={cn('mt-1 text-sm text-gray-500 dark:text-zinc-400', className)} {...props} />;
}

export function CardContent({ className, ...props }: ViewProps & { className?: string }) {
  return <View className={cn('p-6 pt-0', className)} {...props} />;
}
