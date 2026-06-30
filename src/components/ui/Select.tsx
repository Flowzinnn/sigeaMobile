import { Check, ChevronDown } from 'lucide-react-native';
import { useState } from 'react';
import { FlatList, Modal, Pressable, Text, View } from 'react-native';

import { cn } from '@/lib/cn';

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  title?: string;
  disabled?: boolean;
  className?: string;
}

export function Select({
  value,
  onValueChange,
  options,
  placeholder = 'Selecione',
  title,
  disabled = false,
  className,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find(o => o.value === value);

  return (
    <>
      <Pressable
        disabled={disabled}
        onPress={() => setOpen(true)}
        className={cn(
          'h-11 flex-row items-center justify-between rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3',
          disabled && 'opacity-50',
          className
        )}>
        <Text
          numberOfLines={1}
          className={cn('flex-1 text-sm', selected ? 'text-gray-900 dark:text-zinc-100' : 'text-gray-400')}>
          {selected?.label ?? placeholder}
        </Text>
        <ChevronDown size={16} color="#9ca3af" />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable className="flex-1 justify-end bg-black/40" onPress={() => setOpen(false)}>
          <Pressable
            className="max-h-[70%] rounded-t-2xl bg-white dark:bg-zinc-900"
            onPress={(e) => e.stopPropagation()}>
            <View className="border-b border-gray-100 px-4 py-3 dark:border-zinc-700">
              <Text className="text-base font-semibold text-gray-900 dark:text-zinc-100">
                {title ?? placeholder}
              </Text>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    onValueChange(item.value);
                    setOpen(false);
                  }}
                  className="flex-row items-center justify-between border-b border-gray-50 px-4 py-3 dark:border-zinc-800">
                  <Text className="text-sm text-gray-800 dark:text-zinc-200">{item.label}</Text>
                  {item.value === value && <Check size={16} color="#1f3c68" />}
                </Pressable>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
