import { ScrollView, Text, View } from 'react-native';

import { ReservationsList } from '@/components/ReservationsList';

export default function ReservasScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-100 dark:bg-zinc-950" contentContainerClassName="gap-6 p-4 pb-10">
      <View>
        <Text className="mb-1 text-2xl font-bold text-[#1f3c68]">Gestão de Reservas</Text>
        <Text className="text-sm text-gray-600 dark:text-zinc-400">
          Acompanhe a ocupação, sincronize dados e gerencie reservas ativas.
        </Text>
      </View>

      <View className="rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-3 dark:border-blue-800 dark:bg-blue-900/20">
        <Text className="text-sm text-[#1f3c68] dark:text-blue-300">
          Visualização dedicada para operação de reservas. Os dados abaixo ajudam no acompanhamento diário da ocupação.
        </Text>
      </View>

      <ReservationsList />

      <Text className="mt-2 text-center text-sm text-gray-500 dark:text-zinc-500">© 2026 IFMS - Instituto Federal de Mato Grosso do Sul</Text>
    </ScrollView>
  );
}
