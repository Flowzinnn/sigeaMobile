import { TextInput, type TextInputProps } from 'react-native';

import { cn } from '@/lib/cn';

export function Textarea({ className, ...props }: TextInputProps & { className?: string }) {
  return (
    <TextInput
      multiline
      textAlignVertical="top"
      placeholderTextColor="#9ca3af"
      className={cn(
        'min-h-24 rounded-xl border border-[#c9d8eb] dark:border-zinc-600 bg-white dark:bg-zinc-800 px-4 py-3 text-base text-gray-900 dark:text-zinc-100',
        className
      )}
      {...props}
    />
  );
}
