import { LogOut, Moon, Sun } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { Text, View } from 'react-native';

import { LogoMark } from '@/components/LogoMark';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';

export function Header() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const { user, logout } = useAuth();

  return (
    <View className="flex-row items-center justify-between gap-3 border-b border-gray-200 bg-white/95 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-900/95">
      <View className="flex-1 flex-row items-center gap-3">
        <LogoMark size={40} />
        <View className="flex-1 flex-row items-center gap-2">
          <Text className="text-lg font-bold text-gray-900 dark:text-white">IFMS</Text>
          <View className="h-5 w-px bg-gray-300 dark:bg-zinc-600" />
          <Text className="flex-1 text-sm text-gray-700 dark:text-zinc-200" numberOfLines={1}>
            Central de Salas IFMS
          </Text>
        </View>
      </View>

      <View className="flex-row items-center gap-2">
        <Button variant="ghost" size="icon" onPress={toggleColorScheme} className="rounded-full">
          {colorScheme === 'dark' ? <Sun size={20} color="#a1a1aa" /> : <Moon size={20} color="#52525b" />}
        </Button>

        <View className="flex-row items-center gap-2">
          {!!user?.email && (
            <Text
              className="max-w-[90px] text-sm font-medium text-gray-700 dark:text-zinc-200"
              numberOfLines={1}>
              {user.email}
            </Text>
          )}
          <Button onPress={logout} size="sm" className="rounded-full bg-emerald-600 active:bg-emerald-700">
            <LogOut size={16} color="white" />
            Sair
          </Button>
        </View>
      </View>
    </View>
  );
}
