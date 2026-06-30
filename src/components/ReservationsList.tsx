import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  Clock3,
  Download,
  RefreshCcw,
  Trash2,
  XCircle,
} from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { NewReservationDialog } from '@/components/NewReservationDialog';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  deleteReservation,
  getRecentReservations,
  updateReservationStatus,
  type RecentReservation,
} from '@/data/reservationsApi';

function getStatusBadgeClass(status: RecentReservation['status']) {
  if (status === 'Concluida') return 'bg-blue-600';
  if (status === 'Cancelada') return 'bg-rose-600';
  return 'bg-emerald-600';
}

function ReservationCard({
  reservation,
  onComplete,
  onCancel,
  onDelete,
}: {
  reservation: RecentReservation;
  onComplete: () => void;
  onCancel: () => void;
  onDelete: () => void;
}) {
  return (
    <View className="gap-3 rounded-lg border border-gray-100 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
      <View className="flex-row items-start justify-between gap-2">
        <View className="flex-1">
          <Text className="text-base font-semibold text-gray-900 dark:text-zinc-100">{reservation.room}</Text>
          <Text className="mt-0.5 text-xs text-gray-500 dark:text-zinc-400">
            {reservation.date} • {reservation.time}
          </Text>
        </View>
        <Badge className={getStatusBadgeClass(reservation.status)}>{reservation.status}</Badge>
      </View>

      <View className="flex-row items-center gap-2">
        <View className="h-8 w-8 items-center justify-center rounded-full bg-[#dbe8f9] dark:bg-blue-800">
          <Text className="text-xs font-bold text-[#1f3c68] dark:text-blue-200">{reservation.avatar}</Text>
        </View>
        <Text className="text-sm text-gray-700 dark:text-zinc-300">{reservation.responsible}</Text>
      </View>

      {reservation.status === 'Ativa' && (
        <View className="flex-row gap-2 border-t border-gray-50 pt-3 dark:border-zinc-700">
          <Pressable onPress={onComplete} className="flex-1 flex-row items-center justify-center gap-1.5 rounded-lg bg-blue-50 py-2 dark:bg-blue-900/30">
            <CheckCircle2 size={14} color="#1d4ed8" />
            <Text className="text-xs font-semibold text-blue-700 dark:text-blue-300">Concluir</Text>
          </Pressable>
          <Pressable onPress={onCancel} className="flex-1 flex-row items-center justify-center gap-1.5 rounded-lg bg-rose-50 py-2 dark:bg-rose-900/30">
            <XCircle size={14} color="#be123c" />
            <Text className="text-xs font-semibold text-rose-700 dark:text-rose-300">Cancelar</Text>
          </Pressable>
          <Pressable onPress={onDelete} className="w-10 items-center justify-center rounded-lg bg-gray-50 dark:bg-zinc-700">
            <Trash2 size={14} color="#6b7280" />
          </Pressable>
        </View>
      )}

      {reservation.status !== 'Ativa' && (
        <View className="flex-row justify-end border-t border-gray-50 pt-3 dark:border-zinc-700">
          <Pressable onPress={onDelete} className="flex-row items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-2 dark:bg-zinc-700">
            <Trash2 size={14} color="#6b7280" />
            <Text className="text-xs font-semibold text-gray-600 dark:text-zinc-300">Excluir</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

export function ReservationsList() {
  const [reservations, setReservations] = useState<RecentReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState<'api' | 'default'>('default');
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const sync = async () => {
    setLoading(true);
    const response = await getRecentReservations();
    setReservations(response.reservations);
    setDataSource(response.source);
    setLastSync(new Date());
    setLoading(false);
  };

  useEffect(() => {
    void sync();
  }, []);

  const summary = useMemo(() => {
    const total = reservations.length;
    const active = reservations.filter((r) => r.status === 'Ativa').length;
    const completed = reservations.filter((r) => r.status === 'Concluida').length;
    const canceled = reservations.filter((r) => r.status === 'Cancelada').length;
    return { total, active, completed, canceled };
  }, [reservations]);

  const occupancyRate = summary.total === 0 ? 0 : Math.round((summary.active / summary.total) * 100);

  const upcomingAgenda = useMemo(
    () => reservations.filter((r) => r.status === 'Ativa').slice(0, 4),
    [reservations]
  );

  const handleComplete = async (id: RecentReservation['id']) => {
    await updateReservationStatus(id, 'Concluida');
    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'Concluida' } : r)));
  };

  const handleCancel = async (id: RecentReservation['id']) => {
    await updateReservationStatus(id, 'Cancelada');
    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'Cancelada' } : r)));
  };

  const handleDelete = async (id: RecentReservation['id']) => {
    await deleteReservation(id);
    setReservations((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <View className="gap-6 rounded-xl bg-white p-6 dark:bg-zinc-900" style={{ elevation: 3 }}>
      <View className="gap-3">
        <View>
          <Text className="text-2xl font-bold text-[#1f3c68]">Reservas Recentes</Text>
          <Text className="mt-1 text-sm text-gray-500 dark:text-zinc-400">
            {lastSync ? `Última sincronização: ${lastSync.toLocaleTimeString('pt-BR')}` : 'Sincronização pendente'}
          </Text>
        </View>

        <View className="flex-row items-center gap-3">
          <Badge className={loading ? 'bg-blue-600' : dataSource === 'api' ? 'bg-emerald-600' : 'bg-amber-500'}>
            {loading ? 'Sincronizando...' : dataSource === 'api' ? 'Dados da API externa' : 'Valores padrão de exibição'}
          </Badge>
          <Button variant="outline" size="sm" onPress={() => void sync()} loading={loading}>
            <RefreshCcw size={14} color="#1f3c68" />
            Atualizar
          </Button>
        </View>
      </View>

      {dataSource === 'default' && !loading && (
        <View className="flex-row items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 dark:border-amber-700 dark:bg-amber-900/20">
          <AlertCircle size={16} color="#92400e" />
          <Text className="flex-1 text-xs text-amber-800 dark:text-amber-300">
            API indisponível no momento. Exibindo valores padrão automaticamente.
          </Text>
        </View>
      )}

      {/* Estatisticas */}
      <View className="flex-row flex-wrap gap-3">
        <View className="min-w-[45%] flex-1 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800">
          <Text className="text-xs uppercase tracking-wide text-gray-500 dark:text-zinc-400">Total</Text>
          <Text className="mt-1 text-2xl font-bold text-[#1f3c68] dark:text-blue-300">{summary.total}</Text>
        </View>
        <View className="min-w-[45%] flex-1 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-800 dark:bg-emerald-900/20">
          <Text className="text-xs uppercase tracking-wide text-emerald-700 dark:text-emerald-400">Ativas</Text>
          <Text className="mt-1 text-2xl font-bold text-emerald-700 dark:text-emerald-400">{summary.active}</Text>
        </View>
        <View className="min-w-[45%] flex-1 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-800 dark:bg-blue-900/20">
          <Text className="text-xs uppercase tracking-wide text-blue-700 dark:text-blue-400">Concluídas</Text>
          <Text className="mt-1 text-2xl font-bold text-blue-700 dark:text-blue-400">{summary.completed}</Text>
        </View>
        <View className="min-w-[45%] flex-1 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 dark:border-rose-800 dark:bg-rose-900/20">
          <Text className="text-xs uppercase tracking-wide text-rose-700 dark:text-rose-400">Canceladas</Text>
          <Text className="mt-1 text-2xl font-bold text-rose-700 dark:text-rose-400">{summary.canceled}</Text>
        </View>
      </View>

      {/* Lista */}
      <View className="gap-3">
        {reservations.length > 0 ? (
          reservations.map((reservation) => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              onComplete={() => void handleComplete(reservation.id)}
              onCancel={() => void handleCancel(reservation.id)}
              onDelete={() => void handleDelete(reservation.id)}
            />
          ))
        ) : (
          <Text className="py-6 text-center text-sm text-gray-500 dark:text-zinc-400">Nenhuma reserva recente encontrada.</Text>
        )}
      </View>

      {/* Proximas reservas + ocupacao */}
      <View className="gap-4">
        <View className="rounded-lg border border-gray-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
          <View className="mb-3 flex-row items-center gap-2">
            <Clock3 size={16} color="#1f3c68" />
            <Text className="text-sm font-semibold text-[#1f3c68] dark:text-blue-300">Próximas reservas ativas</Text>
          </View>
          {upcomingAgenda.length > 0 ? (
            <View className="gap-2">
              {upcomingAgenda.map((reservation) => (
                <View
                  key={`agenda-${reservation.id}`}
                  className="flex-row items-center justify-between rounded-md border border-gray-100 bg-gray-50 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900">
                  <View>
                    <Text className="text-sm font-medium text-gray-800 dark:text-zinc-200">{reservation.room}</Text>
                    <Text className="text-xs text-gray-500 dark:text-zinc-400">{reservation.responsible}</Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-sm font-semibold text-[#1f3c68] dark:text-blue-300">{reservation.time}</Text>
                    <Text className="text-xs text-gray-500 dark:text-zinc-400">{reservation.date}</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <Text className="text-sm text-gray-500 dark:text-zinc-400">Sem reservas ativas para o período atual.</Text>
          )}
        </View>

        <View className="rounded-lg border border-gray-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
          <View className="mb-3 flex-row items-center gap-2">
            <BarChart3 size={16} color="#1f3c68" />
            <Text className="text-sm font-semibold text-[#1f3c68] dark:text-blue-300">Resumo operacional do turno</Text>
          </View>
          <Text className="mb-3 text-sm text-gray-600 dark:text-zinc-400">
            Taxa estimada de ocupação com base nas reservas ativas do recorte atual.
          </Text>
          <View className="mb-3 h-2.5 overflow-hidden rounded-full bg-gray-100 dark:bg-zinc-700">
            <View className="h-full rounded-full bg-[#1f5ea4]" style={{ width: `${occupancyRate}%` }} />
          </View>
          <Text className="text-sm font-semibold text-[#1f3c68] dark:text-blue-300">{occupancyRate}% de ocupação prevista</Text>
        </View>
      </View>

      {/* Acoes */}
      <View className="flex-row flex-wrap items-center gap-3">
        <NewReservationDialog onCreated={() => void sync()} />
        <Button variant="outline" className="flex-1">
          <Download size={16} color="#1f3c68" />
          Exportar
        </Button>
      </View>
    </View>
  );
}
