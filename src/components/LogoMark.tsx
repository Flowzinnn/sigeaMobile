import { View } from 'react-native';

import { cn } from '@/lib/cn';

/** Logo IFMS: grade 3x3 de quadrados brancos sobre fundo verde, igual ao site. */
export function LogoMark({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <View
      className={cn('flex-row flex-wrap rounded-lg bg-green-600 p-1', className)}
      style={{ width: size, height: size }}>
      {Array.from({ length: 9 }).map((_, i) => (
        <View key={i} className="rounded-sm bg-white" style={{ width: '30%', height: '30%', margin: '1.65%' }} />
      ))}
    </View>
  );
}
