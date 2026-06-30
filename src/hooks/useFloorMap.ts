import { useCallback, useEffect, useState } from 'react';

import {
  createRoom,
  deleteRoom,
  getBlocks,
  getFloorLayout,
  getFloors,
  saveFloorLayout,
  updateRoomDetails,
  type Block,
  type CreateRoomInput,
  type FloorLayout,
  type RoomDetails,
} from '@/data/roomsApi';

// ─── Hook: lista de blocos e andares (para filtros) ─────────────────
export function useBlocks() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getBlocks()
      .then(setBlocks)
      .finally(() => setLoading(false));
  }, []);

  return { blocks, loading };
}

// ─── Hook: layout de um andar especifico ───────────────────────────
export interface UseFloorMapReturn {
  floor: FloorLayout | null;
  loading: boolean;
  saving: boolean;
  saveLayout: (patch: Partial<Pick<FloorLayout, 'grid' | 'cols' | 'rows'>>) => Promise<void>;
  saveRoomDetails: (roomLabel: string, detailsPatch: RoomDetails) => Promise<void>;
  addRoom: (input: CreateRoomInput) => Promise<void>;
  removeRoom: (roomLabel: string) => Promise<void>;
  refetch: () => void;
}

export function useFloorMap(blockId: string, floorId: string): UseFloorMapReturn {
  const [floor, setFloor] = useState<FloorLayout | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!blockId || !floorId) return;
    setLoading(true);
    getFloorLayout(blockId, floorId)
      .then(setFloor)
      .finally(() => setLoading(false));
  }, [blockId, floorId, tick]);

  const saveLayout = useCallback(
    async (patch: Partial<Pick<FloorLayout, 'grid' | 'cols' | 'rows'>>) => {
      setSaving(true);
      try {
        const updated = await saveFloorLayout(blockId, floorId, patch);
        setFloor(updated);
      } finally {
        setSaving(false);
      }
    },
    [blockId, floorId]
  );

  const saveRoomDetails = useCallback(
    async (roomLabel: string, detailsPatch: RoomDetails) => {
      setSaving(true);
      try {
        const updatedFloor = await updateRoomDetails(blockId, floorId, roomLabel, detailsPatch);
        if (updatedFloor) {
          setFloor(updatedFloor);
        }
      } finally {
        setSaving(false);
      }
    },
    [blockId, floorId]
  );

  const addRoom = useCallback(
    async (input: CreateRoomInput) => {
      setSaving(true);
      try {
        const updated = await createRoom(blockId, floorId, input);
        setFloor(updated);
      } finally {
        setSaving(false);
      }
    },
    [blockId, floorId]
  );

  const removeRoom = useCallback(
    async (roomLabel: string) => {
      setSaving(true);
      try {
        const updated = await deleteRoom(blockId, floorId, roomLabel);
        setFloor(updated);
      } finally {
        setSaving(false);
      }
    },
    [blockId, floorId]
  );

  const refetch = useCallback(() => setTick(t => t + 1), []);

  return { floor, loading, saving, saveLayout, saveRoomDetails, addRoom, removeRoom, refetch };
}

// ─── Hook: andares de um bloco (usado ao trocar bloco no filtro) ───
export function useFloors(blockId: string) {
  const [floors, setFloors] = useState<FloorLayout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!blockId) return;
    setLoading(true);
    getFloors(blockId)
      .then(setFloors)
      .finally(() => setLoading(false));
  }, [blockId]);

  return { floors, loading };
}
