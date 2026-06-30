import { ChevronDown } from 'lucide-react-native';
import { createContext, useContext, useState } from 'react';
import { Pressable, Text, View, type ViewProps } from 'react-native';

import { cn } from '@/lib/cn';

const AccordionContext = createContext<{ openValue: string | null; toggle: (value: string) => void } | null>(null);
const AccordionItemContext = createContext<string>('');

export function Accordion({ className, children, ...props }: ViewProps & { className?: string }) {
  const [openValue, setOpenValue] = useState<string | null>(null);
  const toggle = (value: string) => setOpenValue((current) => (current === value ? null : value));

  return (
    <AccordionContext.Provider value={{ openValue, toggle }}>
      <View className={className} {...props}>
        {children}
      </View>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({ value, className, children }: { value: string; className?: string; children: React.ReactNode }) {
  return (
    <AccordionItemContext.Provider value={value}>
      <View className={cn('border-b border-gray-100 dark:border-zinc-700', className)}>{children}</View>
    </AccordionItemContext.Provider>
  );
}

export function AccordionTrigger({ className, children }: { className?: string; children: React.ReactNode }) {
  const ctx = useContext(AccordionContext);
  const value = useContext(AccordionItemContext);
  if (!ctx) throw new Error('AccordionTrigger deve estar dentro de Accordion');
  const isOpen = ctx.openValue === value;

  return (
    <Pressable onPress={() => ctx.toggle(value)} className="flex-row items-center justify-between gap-3 py-4">
      <Text className={cn('flex-1 text-sm font-medium text-gray-900 dark:text-zinc-100', className)}>{children}</Text>
      <View style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}>
        <ChevronDown size={18} color="#6b7280" />
      </View>
    </Pressable>
  );
}

export function AccordionContent({ children }: { children: React.ReactNode }) {
  const ctx = useContext(AccordionContext);
  const value = useContext(AccordionItemContext);
  if (!ctx) throw new Error('AccordionContent deve estar dentro de Accordion');
  if (ctx.openValue !== value) return null;

  return <Text className="pb-4 text-sm leading-relaxed text-gray-600 dark:text-zinc-400">{children}</Text>;
}
