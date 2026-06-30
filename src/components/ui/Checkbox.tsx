import { Check } from 'lucide-react-native';
import { Pressable } from 'react-native';

import { cn } from '@/lib/cn';

interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

export function Checkbox({ checked, onCheckedChange, className }: CheckboxProps) {
  return (
    <Pressable
      onPress={() => onCheckedChange(!checked)}
      className={cn(
        'h-5 w-5 items-center justify-center rounded border',
        checked ? 'border-[#1f3c68] bg-[#1f3c68]' : 'border-[#9fb8db] bg-white dark:border-zinc-600 dark:bg-zinc-800',
        className
      )}>
      {checked && <Check size={14} color="white" />}
    </Pressable>
  );
}
