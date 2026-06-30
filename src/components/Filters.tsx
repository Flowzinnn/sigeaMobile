import { View } from 'react-native';

import { Select } from '@/components/ui/Select';
import { useBlocks, useFloors } from '@/hooks/useFloorMap';

interface FiltersProps {
  blockId: string;
  floorId: string;
  onBlockChange: (blockId: string) => void;
  onFloorChange: (floorId: string) => void;
}

export function Filters({ blockId, floorId, onBlockChange, onFloorChange }: FiltersProps) {
  const { blocks, loading: loadingBlocks } = useBlocks();
  const { floors, loading: loadingFloors } = useFloors(blockId);

  return (
    <View className="flex-row gap-4">
      <View className="flex-1">
        <Select
          value={blockId}
          onValueChange={onBlockChange}
          disabled={loadingBlocks}
          placeholder="Bloco"
          options={blocks.map((b) => ({ label: b.name, value: b.id }))}
        />
      </View>

      <View className="flex-1">
        <Select
          value={floorId}
          onValueChange={onFloorChange}
          disabled={loadingFloors || floors.length === 0}
          placeholder="Andar"
          options={floors.map((f) => ({ label: f.name, value: f.id }))}
        />
      </View>
    </View>
  );
}
