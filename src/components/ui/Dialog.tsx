import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

import { cn } from '@/lib/cn';
import { renderMixedChildren } from '@/lib/mixedChildren';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={() => onOpenChange(false)}>
      <Pressable
        className="flex-1 items-center justify-center bg-black/50 px-4"
        onPress={() => onOpenChange(false)}>
        <Pressable className="w-full max-w-md" onPress={(e) => e.stopPropagation()}>
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export function DialogContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <View
      className={cn('w-full rounded-2xl bg-white p-6 dark:bg-zinc-900', className)}
      style={{ elevation: 8, maxHeight: '85%' }}>
      <ScrollView showsVerticalScrollIndicator={false}>{children}</ScrollView>
    </View>
  );
}

export function DialogHeader({ children }: { children: React.ReactNode }) {
  return <View className="mb-4">{children}</View>;
}

export function DialogTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <View className="flex-row items-center gap-2">
      {renderMixedChildren(children, cn('text-xl font-bold text-[#1f3c68] dark:text-blue-300', className))}
    </View>
  );
}

export function DialogDescription({ children }: { children: React.ReactNode }) {
  return <Text className="mt-1 text-sm text-gray-500 dark:text-zinc-400">{children}</Text>;
}

export function DialogFooter({ children }: { children: React.ReactNode }) {
  return <View className="mt-2 flex-row gap-3">{children}</View>;
}
