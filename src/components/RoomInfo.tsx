import { ChevronDown, Home, ImageIcon, ListOrdered, MapPin, Plus, Save, Trash2, User, Users } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { ImageWithFallback } from '@/components/ImageWithFallback';
import { NewReservationDialog } from '@/components/NewReservationDialog';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import type { RoomDetails, Tile } from '@/data/roomsApi';

interface RoomInfoProps {
  roomId: string;
  blockId: string;
  floorName: string;
  roomTile?: Tile | null;
  saving?: boolean;
  collapseSignal?: number;
  onSaveDetails?: (roomLabel: string, detailsPatch: RoomDetails) => Promise<void>;
  onDeleteRoom?: (roomLabel: string) => Promise<void>;
}

const DEFAULT_PHOTO = 'https://www.hojemais.com.br/imagem/noticia/1000/1000/1598047640_62013.jpg';

function buildFallbackDetails(roomId: string, blockId: string, floorName: string): RoomDetails {
  return {
    photoUrl: DEFAULT_PHOTO,
    description: `${roomId} configurada para atividades academicas e uso diario da comunidade escolar.`,
    location: `Bloco ${blockId}, ${floorName || 'Andar nao informado'}`,
    directions: [
      'Entre pelo portao principal do campus',
      `Siga em direcao ao Bloco ${blockId}`,
      `Localize o ${floorName || 'andar selecionado'} pelas placas de orientacao`,
      `A ${roomId} fica no corredor principal`,
    ],
  };
}

export function RoomInfo({
  roomId,
  blockId,
  floorName,
  roomTile,
  saving = false,
  collapseSignal = 0,
  onSaveDetails,
  onDeleteRoom,
}: RoomInfoProps) {
  const [formData, setFormData] = useState({
    photoUrl: DEFAULT_PHOTO,
    description: '',
    location: '',
    directionsText: '',
  });
  const [savingDetails, setSavingDetails] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isDetailsFormOpen, setIsDetailsFormOpen] = useState(false);

  useEffect(() => {
    if (!roomId) {
      setFeedbackMessage('');
      return;
    }

    const fallback = buildFallbackDetails(roomId, blockId, floorName);
    const details = roomTile?.details ?? fallback;

    setFormData({
      photoUrl: details.photoUrl || DEFAULT_PHOTO,
      description: details.description || fallback.description || '',
      location: details.location || fallback.location || '',
      directionsText: (details.directions && details.directions.length > 0 ? details.directions : fallback.directions || []).join('\n'),
    });
    setFeedbackMessage('');
  }, [roomId, roomTile, blockId, floorName]);

  useEffect(() => {
    setIsDetailsFormOpen(false);
  }, [collapseSignal, roomId]);

  if (!roomId) {
    return (
      <View className="rounded-xl bg-white p-6 dark:bg-zinc-900" style={{ elevation: 3 }}>
        <Text className="mb-3 text-lg font-semibold text-[#1f3c68]">Informações da Sala</Text>
        <Text className="text-sm text-gray-500 dark:text-zinc-400">
          Toque em uma sala no mapa para visualizar e editar foto, descrição, localização e passos para chegar.
        </Text>
      </View>
    );
  }

  const roomStatus = roomTile?.status ?? 'available';
  const roomCapacity = roomTile?.capacity ?? 30;
  const roomCategory = roomTile?.category ?? 'Sala comum';
  const roomReservations = roomTile?.reservations ?? [];
  const defaultReservationRoom = roomId.startsWith('Sala ') ? roomId.replace('Sala ', '') : '';

  const handleSaveDetails = async () => {
    if (!onSaveDetails) return;

    const directions = formData.directionsText
      .split('\n')
      .map((step) => step.trim())
      .filter(Boolean);

    setSavingDetails(true);
    setFeedbackMessage('');
    try {
      await onSaveDetails(roomId, {
        photoUrl: formData.photoUrl.trim() || DEFAULT_PHOTO,
        description: formData.description.trim(),
        location: formData.location.trim(),
        directions,
      });
      setFeedbackMessage('Detalhes da sala salvos com sucesso.');
      setIsDetailsFormOpen(false);
    } finally {
      setSavingDetails(false);
    }
  };

  const handleDelete = async () => {
    if (!onDeleteRoom) return;
    setDeleting(true);
    try {
      await onDeleteRoom(roomId);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <View className="rounded-xl bg-white p-6 dark:bg-zinc-900" style={{ elevation: 3 }}>
      <View className="gap-6">
        {/* Header */}
        <View>
          <Text className="mb-4 text-lg font-semibold text-[#1f3c68]">Informações da Sala</Text>

          <View className="gap-2">
            <Text className="text-2xl font-bold text-gray-900 dark:text-zinc-100">{roomId}</Text>

            <View className="flex-row items-center gap-2">
              <Users size={16} color="#374151" />
              <Text className="text-sm text-gray-700 dark:text-zinc-300">{roomCapacity} lugares</Text>
            </View>

            <View className="flex-row items-center gap-2">
              <Home size={16} color="#374151" />
              <Text className="text-sm text-gray-700 dark:text-zinc-300">{roomCategory}</Text>
            </View>

            <Badge className={roomStatus === 'occupied' ? 'bg-red-600' : 'bg-green-600'}>
              {roomStatus === 'occupied' ? 'Ocupada' : 'Disponivel'}
            </Badge>
          </View>
        </View>

        {/* Reservas */}
        <View className="gap-4 border-t border-gray-100 pt-6 dark:border-zinc-700">
          <Text className="text-base font-semibold text-gray-900 dark:text-zinc-200">Reservas Agendadas</Text>

          {roomReservations.length > 0 ? (
            <View className="gap-3">
              {roomReservations.map((reservation, index) => (
                <View key={index} className="flex-row items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-green-600">
                    <User size={18} color="white" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-gray-900 dark:text-zinc-100">
                      {reservation.date}, {reservation.time}
                    </Text>
                    <Text className="mt-1 text-xs text-gray-600 dark:text-zinc-400">Reservado por: {reservation.user}</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <Text className="text-sm text-gray-500 dark:text-zinc-400">Nenhuma reserva agendada</Text>
          )}

          <NewReservationDialog
            defaultRoom={defaultReservationRoom}
            trigger={
              <Button className="bg-[#4a90e2] active:bg-[#3a7bc8]">
                <Plus size={16} color="white" />
                Nova Reserva
              </Button>
            }
          />
        </View>

        {/* Formulario de detalhes dinamicos */}
        <View className="border-t border-gray-100 pt-6 dark:border-zinc-700">
          <Button
            variant="ghost"
            onPress={() => setIsDetailsFormOpen((open) => !open)}
            className="flex-row items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 dark:border-zinc-700 dark:bg-zinc-800">
            <Text className="flex-1 text-sm font-semibold text-[#1f3c68] dark:text-blue-300">Detalhes dinâmicos da sala</Text>
            <View style={{ transform: [{ rotate: isDetailsFormOpen ? '180deg' : '0deg' }] }}>
              <ChevronDown size={16} color="#1f3c68" />
            </View>
          </Button>

          {feedbackMessage ? (
            <Text className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300">
              {feedbackMessage}
            </Text>
          ) : null}

          {isDetailsFormOpen && (
            <View className="mt-4 gap-4">
              <View>
                <Label>
                  <ImageIcon size={14} color="#243b5d" />
                  Foto (URL)
                </Label>
                <Input
                  placeholder="https://..."
                  value={formData.photoUrl}
                  onChangeText={(text) => setFormData((prev) => ({ ...prev, photoUrl: text }))}
                />
              </View>

              <View className="h-36 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-zinc-700 dark:bg-zinc-800">
                <ImageWithFallback src={formData.photoUrl || DEFAULT_PHOTO} className="h-full w-full" resizeMode="cover" />
              </View>

              <View>
                <Label>Descrição da sala</Label>
                <Textarea
                  value={formData.description}
                  onChangeText={(text) => setFormData((prev) => ({ ...prev, description: text }))}
                  placeholder="Exemplo: laboratorio com 30 maquinas e projetor"
                />
              </View>

              <View>
                <Label>
                  <MapPin size={14} color="#243b5d" />
                  Localização
                </Label>
                <Input
                  value={formData.location}
                  onChangeText={(text) => setFormData((prev) => ({ ...prev, location: text }))}
                  placeholder="Exemplo: Bloco A, Terreo"
                />
              </View>

              <View>
                <Label>
                  <ListOrdered size={14} color="#243b5d" />
                  Passos para chegar (1 por linha)
                </Label>
                <Textarea
                  value={formData.directionsText}
                  onChangeText={(text) => setFormData((prev) => ({ ...prev, directionsText: text }))}
                  placeholder={'Entre pelo portao principal\nSiga para o Bloco A\n...'}
                  className="min-h-28"
                />
              </View>

              <Button onPress={handleSaveDetails} loading={saving || savingDetails}>
                <Save size={16} color="white" />
                {saving || savingDetails ? 'Salvando detalhes...' : 'Salvar Detalhes da Sala'}
              </Button>
            </View>
          )}
        </View>

        {/* Excluir sala */}
        {onDeleteRoom && (
          <View className="border-t border-gray-100 pt-6 dark:border-zinc-700">
            <Button variant="destructive" onPress={handleDelete} loading={deleting}>
              <Trash2 size={16} color="white" />
              {deleting ? 'Excluindo...' : 'Excluir Sala'}
            </Button>
          </View>
        )}
      </View>
    </View>
  );
}
