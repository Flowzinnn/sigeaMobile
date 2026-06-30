import { ArrowUpDown, Bath, DoorOpen, Eye, GripVertical, Minus, Pencil, Save, Wrench, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import type { GridData, Tile, TileType } from '@/data/roomsApi';

interface RoomMapProps {
  /** Texto exibido no cabecalho, ex: "1º Andar - Bloco A" */
  floorName?: string;
  initialGrid?: GridData;
  initialCols?: number;
  initialRows?: number;
  /** Se true: esconde o botao de editar layout */
  readOnly?: boolean;
  onSave?: (grid: GridData, cols: number, rows: number) => Promise<void>;
  saving?: boolean;
  onRoomSelect: (roomId: string) => void;
}

const FALLBACK_COLS = 5;
const FALLBACK_ROWS = 3;
const MIN_SIZE = 2;
const MAX_SIZE = 12;
const FALLBACK_GRID: GridData = {};
const CELL_SIZE = 84;

const PALETTE_ITEMS: { type: TileType; label: string }[] = [
  { type: 'room', label: 'Sala' },
  { type: 'corridor', label: 'Corredor' },
  { type: 'bathroom', label: 'Banheiro' },
  { type: 'stairs', label: 'Escada' },
  { type: 'entrance', label: 'Entrada' },
  { type: 'wall', label: 'Parede' },
];

type ArmedTool =
  | { source: 'palette'; tileType: TileType }
  | { source: 'cell'; cellId: string; tile: Tile };

function getTileBgClass(tile: Tile): string {
  switch (tile.type) {
    case 'room':
      if (tile.status === 'occupied') return 'bg-red-600';
      if (tile.status === 'maintenance') return 'bg-gray-400';
      return 'bg-green-600';
    case 'corridor':
      return 'bg-gray-300';
    case 'bathroom':
      return 'bg-blue-200';
    case 'stairs':
      return 'bg-orange-200';
    case 'entrance':
      return 'bg-purple-200';
    case 'wall':
      return 'bg-gray-700';
  }
}

function getTileTextClass(type: TileType): string {
  if (type === 'room') return 'text-white';
  if (type === 'wall') return 'text-gray-100';
  if (type === 'bathroom') return 'text-blue-800';
  if (type === 'stairs') return 'text-orange-800';
  if (type === 'entrance') return 'text-purple-800';
  return 'text-gray-700';
}

function getTileIconColor(type: TileType): string {
  switch (type) {
    case 'room':
      return '#ffffff';
    case 'wall':
      return '#f3f4f6';
    case 'bathroom':
      return '#1e40af';
    case 'stairs':
      return '#9a3412';
    case 'entrance':
      return '#6b21a8';
    default:
      return '#374151';
  }
}

function getPaletteBgClass(type: TileType): string {
  switch (type) {
    case 'room':
      return 'bg-green-600';
    case 'corridor':
      return 'bg-gray-300';
    case 'bathroom':
      return 'bg-blue-200';
    case 'stairs':
      return 'bg-orange-200';
    case 'entrance':
      return 'bg-purple-200';
    case 'wall':
      return 'bg-gray-700';
  }
}

function getPaletteTextClass(type: TileType): string {
  if (type === 'room' || type === 'wall') return 'text-white';
  if (type === 'bathroom') return 'text-blue-800';
  if (type === 'stairs') return 'text-orange-800';
  if (type === 'entrance') return 'text-purple-800';
  return 'text-gray-700';
}

function TileIcon({ type, size = 16, color }: { type: TileType; size?: number; color?: string }) {
  if (type === 'bathroom') return <Bath size={size} color={color} />;
  if (type === 'stairs') return <ArrowUpDown size={size} color={color} />;
  if (type === 'entrance') return <DoorOpen size={size} color={color} />;
  if (type === 'wall') return <Minus size={size} color={color} />;
  if (type === 'corridor') return <GripVertical size={size} color={color} />;
  return null;
}

function PaletteChip({ type, label, armed, onPress }: { type: TileType; label: string; armed: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'mr-2 flex-row items-center gap-1.5 rounded-lg px-3 py-2',
        getPaletteBgClass(type),
        armed && 'border-2 border-[#1f3c68]'
      )}>
      <TileIcon type={type} size={14} color={getTileIconColor(type)} />
      <Text className={cn('text-xs font-medium', getPaletteTextClass(type))}>{label}</Text>
    </Pressable>
  );
}

function GridCell({
  tile,
  isSelected,
  isEditMode,
  isArmedSource,
  onPress,
  onLongPress,
  onRemove,
}: {
  tile?: Tile;
  isSelected: boolean;
  isEditMode: boolean;
  isArmedSource: boolean;
  onPress: () => void;
  onLongPress: () => void;
  onRemove: () => void;
}) {
  const isEmpty = !tile;

  return (
    <View style={{ width: CELL_SIZE, height: CELL_SIZE }} className="relative mb-2 mr-2">
      <Pressable
        onPress={onPress}
        onLongPress={isEditMode && tile ? onLongPress : undefined}
        className={cn(
          'h-full w-full items-center justify-center rounded-lg p-1',
          isEmpty ? 'border-2 border-dashed border-gray-200 dark:border-zinc-700' : getTileBgClass(tile),
          isSelected && !isEmpty && 'border-2 border-yellow-400',
          isArmedSource && 'opacity-40'
        )}>
        {tile && (
          <View className="items-center justify-center gap-0.5">
            <TileIcon type={tile.type} size={16} color={getTileIconColor(tile.type)} />
            <Text numberOfLines={2} className={cn('text-center text-[11px] font-semibold leading-tight', getTileTextClass(tile.type))}>
              {tile.label || PALETTE_ITEMS.find((p) => p.type === tile.type)?.label}
            </Text>
            {tile.type === 'room' && tile.status === 'maintenance' && <Wrench size={11} color="#374151" />}
          </View>
        )}
      </Pressable>

      {isEditMode && tile && (
        <Pressable onPress={onRemove} className="absolute right-1 top-1 z-10 h-5 w-5 items-center justify-center rounded bg-black/40">
          <X size={12} color="white" />
        </Pressable>
      )}
    </View>
  );
}

function SizeStepper({
  label,
  value,
  onDecrease,
  onIncrease,
}: {
  label: string;
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  const disabledDecrease = value <= MIN_SIZE;
  const disabledIncrease = value >= MAX_SIZE;

  return (
    <View className="flex-row items-center justify-between gap-2">
      <Text className="text-xs text-gray-600 dark:text-zinc-400">{label}</Text>
      <View className="flex-row items-center gap-1.5">
        <Pressable
          disabled={disabledDecrease}
          onPress={onDecrease}
          className={cn('h-6 w-6 items-center justify-center rounded bg-gray-200 dark:bg-zinc-700', disabledDecrease && 'opacity-40')}>
          <Text className="text-sm font-bold leading-none text-gray-700 dark:text-zinc-200">−</Text>
        </Pressable>
        <Text className="w-5 text-center text-xs font-semibold text-gray-700 dark:text-zinc-200">{value}</Text>
        <Pressable
          disabled={disabledIncrease}
          onPress={onIncrease}
          className={cn('h-6 w-6 items-center justify-center rounded bg-gray-200 dark:bg-zinc-700', disabledIncrease && 'opacity-40')}>
          <Text className="text-sm font-bold leading-none text-gray-700 dark:text-zinc-200">+</Text>
        </Pressable>
      </View>
    </View>
  );
}

function LegendItem({ colorClass, text }: { colorClass: string; text: string }) {
  return (
    <View className="flex-row items-center gap-1.5">
      <View className={cn('h-4 w-6 rounded', colorClass)} />
      <Text className="text-xs text-gray-600 dark:text-zinc-400">{text}</Text>
    </View>
  );
}

export function RoomMap({
  floorName,
  initialGrid,
  initialCols,
  initialRows,
  readOnly = false,
  onSave,
  saving = false,
  onRoomSelect,
}: RoomMapProps) {
  const [grid, setGrid] = useState<GridData>(initialGrid ?? FALLBACK_GRID);
  const [selectedCell, setSelectedCell] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [armedTool, setArmedTool] = useState<ArmedTool | null>(null);
  const [roomCounter, setRoomCounter] = useState(109);
  const [cols, setCols] = useState(initialCols ?? FALLBACK_COLS);
  const [rows, setRows] = useState(initialRows ?? FALLBACK_ROWS);

  useEffect(() => {
    setGrid(initialGrid ?? FALLBACK_GRID);
    setCols(initialCols ?? FALLBACK_COLS);
    setRows(initialRows ?? FALLBACK_ROWS);
    setSelectedCell('');
    setIsEditMode(false);
    setArmedTool(null);
  }, [initialGrid, initialCols, initialRows]);

  const handleSave = async () => {
    if (onSave) await onSave(grid, cols, rows);
    setIsEditMode(false);
    setArmedTool(null);
  };

  const changeSize = (axis: 'cols' | 'rows', delta: number) => {
    if (axis === 'cols') {
      const next = Math.min(MAX_SIZE, Math.max(MIN_SIZE, cols + delta));
      if (next < cols) {
        setGrid((prev) => {
          const cleaned = { ...prev };
          Object.keys(cleaned).forEach((key) => {
            const col = parseInt(key.split('-')[1], 10);
            if (col >= next) delete cleaned[key];
          });
          return cleaned;
        });
      }
      setCols(next);
    } else {
      const next = Math.min(MAX_SIZE, Math.max(MIN_SIZE, rows + delta));
      if (next < rows) {
        setGrid((prev) => {
          const cleaned = { ...prev };
          Object.keys(cleaned).forEach((key) => {
            const row = parseInt(key.split('-')[0], 10);
            if (row >= next) delete cleaned[key];
          });
          return cleaned;
        });
      }
      setRows(next);
    }
  };

  const handleArmPalette = (tileType: TileType) => {
    setArmedTool((current) => (current?.source === 'palette' && current.tileType === tileType ? null : { source: 'palette', tileType }));
  };

  const handlePickUp = (cellId: string) => {
    const tile = grid[cellId];
    if (!tile) return;
    setArmedTool({ source: 'cell', cellId, tile });
  };

  const handleCellPress = (cellId: string) => {
    const tile = grid[cellId];

    if (isEditMode && armedTool) {
      if (armedTool.source === 'palette') {
        const type = armedTool.tileType;
        let newTile: Tile;
        if (type === 'room') {
          newTile = { type: 'room', label: `Sala ${roomCounter}`, status: 'available' };
          setRoomCounter((c) => c + 1);
        } else {
          newTile = { type, label: PALETTE_ITEMS.find((p) => p.type === type)?.label };
        }
        setGrid((prev) => ({ ...prev, [cellId]: newTile }));
      } else {
        const fromCellId = armedTool.cellId;
        if (fromCellId !== cellId) {
          setGrid((prev) => {
            const next = { ...prev };
            const movingTile = next[fromCellId];
            const targetTile = next[cellId];
            if (targetTile) next[fromCellId] = targetTile;
            else delete next[fromCellId];
            next[cellId] = movingTile;
            return next;
          });
          if (selectedCell === fromCellId) setSelectedCell(cellId);
        }
      }
      setArmedTool(null);
      return;
    }

    if (tile?.type === 'room') {
      setSelectedCell(cellId);
      onRoomSelect(tile.label ?? cellId);
    }
  };

  const handleRemove = (cellId: string) => {
    setGrid((prev) => {
      const next = { ...prev };
      delete next[cellId];
      return next;
    });
    setArmedTool((current) => (current?.source === 'cell' && current.cellId === cellId ? null : current));
  };

  const cellRows = Array.from({ length: rows }, (_, row) => row);
  const cellCols = Array.from({ length: cols }, (_, col) => col);

  return (
    <View className="overflow-hidden rounded-xl bg-white dark:bg-zinc-900" style={{ elevation: 3 }}>
      {/* Cabecalho */}
      <View className="flex-row items-center justify-between bg-[#1f3c68] px-4 py-3">
        <Text className="flex-1 font-medium text-white" numberOfLines={1}>
          {floorName ?? 'Mapa'}
        </Text>
        <View className="flex-row items-center gap-2">
          {isEditMode && onSave && (
            <Button onPress={handleSave} loading={saving} size="sm" className="bg-green-400 active:bg-green-300" textClassName="text-green-900">
              <Save size={14} color="#14532d" />
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          )}
          {!readOnly && (
            <Button
              onPress={() => setIsEditMode((v) => !v)}
              size="sm"
              className={isEditMode ? 'bg-yellow-400 active:bg-yellow-300' : 'bg-white/20 active:bg-white/30'}
              textClassName={isEditMode ? 'text-yellow-900' : 'text-white'}>
              {isEditMode ? <Eye size={14} color="#713f12" /> : <Pencil size={14} color="white" />}
              {isEditMode ? 'Visualizar' : 'Editar Layout'}
            </Button>
          )}
        </View>
      </View>

      {/* Dica contextual */}
      <View
        className={cn(
          'border-b px-4 py-2',
          isEditMode
            ? 'border-yellow-100 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20'
            : 'border-blue-100 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
        )}>
        <Text className={cn('text-xs', isEditMode ? 'text-yellow-700 dark:text-yellow-300' : 'text-blue-600 dark:text-blue-400')}>
          {isEditMode
            ? 'Toque num item da paleta e depois na célula • Toque e segure numa célula para mover • Toque no ✕ para remover'
            : 'Toque em uma sala para ver detalhes • Use "Editar Layout" para reorganizar o mapa'}
        </Text>
      </View>

      {/* Status da ferramenta selecionada */}
      {isEditMode && armedTool && (
        <View className="flex-row items-center justify-between gap-2 border-b border-gray-100 bg-gray-50 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-800">
          <Text className="flex-1 text-xs font-medium text-[#1f3c68] dark:text-blue-300">
            {armedTool.source === 'palette'
              ? `Selecionado: ${PALETTE_ITEMS.find((p) => p.type === armedTool.tileType)?.label}. Toque numa célula.`
              : `Movendo: ${armedTool.tile.label ?? 'item'}. Toque no destino.`}
          </Text>
          <Pressable onPress={() => setArmedTool(null)}>
            <Text className="text-xs font-semibold text-gray-500 dark:text-zinc-400">Cancelar</Text>
          </Pressable>
        </View>
      )}

      <View className="p-4">
        {/* Paleta (somente em modo edicao) */}
        {isEditMode && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
            {PALETTE_ITEMS.map((item) => (
              <PaletteChip
                key={item.type}
                type={item.type}
                label={item.label}
                armed={armedTool?.source === 'palette' && armedTool.tileType === item.type}
                onPress={() => handleArmPalette(item.type)}
              />
            ))}
          </ScrollView>
        )}

        {/* Controles de tamanho do grid */}
        {isEditMode && (
          <View className="mb-3 flex-row gap-6 rounded-lg bg-gray-50 px-3 py-2 dark:bg-zinc-800">
            <SizeStepper label="Colunas" value={cols} onDecrease={() => changeSize('cols', -1)} onIncrease={() => changeSize('cols', 1)} />
            <SizeStepper label="Linhas" value={rows} onDecrease={() => changeSize('rows', -1)} onIncrease={() => changeSize('rows', 1)} />
          </View>
        )}

        {/* Grid */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View>
            {cellRows.map((row) => (
              <View key={row} className="flex-row">
                {cellCols.map((col) => {
                  const cellId = `${row}-${col}`;
                  return (
                    <GridCell
                      key={cellId}
                      tile={grid[cellId]}
                      isSelected={selectedCell === cellId}
                      isEditMode={isEditMode}
                      isArmedSource={armedTool?.source === 'cell' && armedTool.cellId === cellId}
                      onPress={() => handleCellPress(cellId)}
                      onLongPress={() => handlePickUp(cellId)}
                      onRemove={() => handleRemove(cellId)}
                    />
                  );
                })}
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Legenda */}
        <View className="mt-2 flex-row flex-wrap gap-4 border-t border-gray-100 pt-3 dark:border-zinc-700">
          <LegendItem colorClass="bg-green-600" text="Livre" />
          <LegendItem colorClass="bg-red-600" text="Ocupada" />
          <LegendItem colorClass="bg-gray-400" text="Manutenção" />
          <LegendItem colorClass="bg-gray-300" text="Corredor" />
          <LegendItem colorClass="bg-blue-200" text="Banheiro" />
          <LegendItem colorClass="bg-purple-200" text="Entrada" />
        </View>
      </View>
    </View>
  );
}
