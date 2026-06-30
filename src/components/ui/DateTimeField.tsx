import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar, Clock } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Text } from 'react-native';

import { cn } from '@/lib/cn';

interface DateTimeFieldProps {
  mode: 'date' | 'time';
  value: Date | null;
  onChange: (date: Date) => void;
  placeholder: string;
  className?: string;
}

function formatValue(mode: 'date' | 'time', value: Date) {
  if (mode === 'date') return value.toLocaleDateString('pt-BR');
  return value.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export function DateTimeField({ mode, value, onChange, placeholder, className }: DateTimeFieldProps) {
  const [open, setOpen] = useState(false);
  const Icon = mode === 'date' ? Calendar : Clock;

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        className={cn(
          'h-12 flex-row items-center gap-2 rounded-xl border border-[#c9d8eb] bg-white px-4 dark:border-zinc-600 dark:bg-zinc-800',
          className
        )}>
        <Icon size={16} color="#9ca3af" />
        <Text className={cn('text-base', value ? 'text-gray-900 dark:text-zinc-100' : 'text-gray-400')}>
          {value ? formatValue(mode, value) : placeholder}
        </Text>
      </Pressable>

      {open && (
        <DateTimePicker
          value={value ?? new Date()}
          mode={mode}
          is24Hour
          display="default"
          onChange={(_event, selectedDate) => {
            setOpen(false);
            if (selectedDate) onChange(selectedDate);
          }}
        />
      )}
    </>
  );
}
