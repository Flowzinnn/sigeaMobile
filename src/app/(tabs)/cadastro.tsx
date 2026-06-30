import { Plus } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { Filters } from '@/components/Filters';
import { NewRoomDialog } from '@/components/NewRoomDialog';
import { RoomInfo } from '@/components/RoomInfo';
import { RoomMap } from '@/components/RoomMap';
import { Button } from '@/components/ui/Button';
import type { GridData, RoomDetails } from '@/data/roomsApi';
import { useBlocks, useFloorMap } from '@/hooks/useFloorMap';

export default function CadastroScreen() {
  const [selectedRoom, setSelectedRoom] = useState('');
  const [blockId, setBlockId] = useState('A');
  const [floorId, setFloorId] = useState('A-1');
  const [detailsCollapseSignal, setDetailsCollapseSignal] = useState(0);

  const { blocks } = useBlocks();
  const { floor, loading, saving, saveLayout, saveRoomDetails, addRoom, removeRoom } = useFloorMap(blockId, floorId);

  useEffect(() => {
    const block = blocks.find((b) => b.id === blockId);
    if (block && block.floors.length > 0) {
      setFloorId(block.floors[0].id);
    }
  }, [blockId, blocks]);

  const floorLabel = floor ? `${floor.name} – Bloco ${blockId}` : 'Carregando...';

  const selectedRoomTile = useMemo(() => {
    if (!floor || !selectedRoom) return null;
    return Object.values(floor.grid).find((tile) => tile.type === 'room' && tile.label === selectedRoom) ?? null;
  }, [floor, selectedRoom]);

  const handleSaveLayout = async (grid: GridData, cols: number, rows: number) => {
    await saveLayout({ grid, cols, rows });
    setDetailsCollapseSignal((s) => s + 1);
  };

  const handleSaveRoomDetails = async (roomLabel: string, detailsPatch: RoomDetails) => {
    await saveRoomDetails(roomLabel, detailsPatch);
    setDetailsCollapseSignal((s) => s + 1);
  };

  const handleDeleteRoom = async (roomLabel: string) => {
    await removeRoom(roomLabel);
    setSelectedRoom('');
  };

  return (
    <ScrollView className="flex-1 bg-gray-100 dark:bg-zinc-950" contentContainerClassName="gap-6 p-4 pb-10">
      <View>
        <Text className="mb-1 text-2xl font-bold text-[#1f3c68]">Cadastro e Mapa de Salas</Text>
        <Text className="text-sm text-gray-600 dark:text-zinc-400">
          Gerencie o layout dos blocos e os detalhes das salas em um único fluxo.
        </Text>
      </View>

      <Filters blockId={blockId} floorId={floorId} onBlockChange={setBlockId} onFloorChange={setFloorId} />

      <NewRoomDialog
        locationLabel={floorLabel}
        onCreate={(input) => addRoom(input)}
        trigger={
          <Button variant="outline" className="self-start">
            <Plus size={16} color="#1f3c68" />
            Nova Sala
          </Button>
        }
      />

      {loading ? (
        <View className="items-center justify-center rounded-xl bg-white p-12 dark:bg-zinc-900" style={{ elevation: 3 }}>
          <Text className="text-gray-400 dark:text-zinc-500">Carregando mapa...</Text>
        </View>
      ) : (
        <View className="gap-6">
          <RoomMap
            floorName={floorLabel}
            initialGrid={floor?.grid}
            initialCols={floor?.cols}
            initialRows={floor?.rows}
            onSave={handleSaveLayout}
            saving={saving}
            onRoomSelect={setSelectedRoom}
          />
          <RoomInfo
            roomId={selectedRoom}
            blockId={blockId}
            floorName={floor?.name ?? ''}
            roomTile={selectedRoomTile}
            saving={saving}
            collapseSignal={detailsCollapseSignal}
            onSaveDetails={handleSaveRoomDetails}
            onDeleteRoom={selectedRoom ? handleDeleteRoom : undefined}
          />
        </View>
      )}

      <Text className="mt-2 text-center text-sm text-gray-500 dark:text-zinc-500">© 2026 IFMS - Instituto Federal de Mato Grosso do Sul</Text>
    </ScrollView>
  );
}
