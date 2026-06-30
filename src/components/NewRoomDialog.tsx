import { Home, Plus } from 'lucide-react-native';
import { cloneElement, useState, type ReactElement } from 'react';
import { Alert, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import type { CreateRoomInput } from '@/data/roomsApi';

interface NewRoomDialogProps {
  trigger?: ReactElement;
  /** Texto exibido no formulário, ex: "Bloco A - 1º Andar" */
  locationLabel: string;
  onCreate: (input: CreateRoomInput) => Promise<void>;
}

const TYPE_OPTIONS = [
  { label: 'Sala Comum', value: 'Sala comum' },
  { label: 'Laboratório', value: 'Laboratório' },
  { label: 'Auditório', value: 'Auditório' },
  { label: 'Sala de Reunião', value: 'Sala de Reunião' },
  { label: 'Informática', value: 'Informática' },
];

export function NewRoomDialog({ trigger, locationLabel, onCreate }: NewRoomDialogProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [type, setType] = useState('');
  const [equipment, setEquipment] = useState('');

  const reset = () => {
    setName('');
    setCapacity('');
    setType('');
    setEquipment('');
  };

  const handleSubmit = async () => {
    if (!name.trim() || !capacity || !type) {
      Alert.alert('Campos obrigatórios', 'Preencha nome, capacidade e tipo de sala.');
      return;
    }

    setSubmitting(true);
    try {
      await onCreate({
        label: name.trim(),
        capacity: Number(capacity),
        category: type,
        status: 'available',
      });
      setOpen(false);
      reset();
    } finally {
      setSubmitting(false);
    }
  };

  const triggerElement = trigger ? (
    cloneElement(trigger, { onPress: () => setOpen(true) } as Record<string, unknown>)
  ) : (
    <Button variant="outline" onPress={() => setOpen(true)}>
      <Plus size={16} color="#1f3c68" />
      Nova Sala
    </Button>
  );

  return (
    <>
      {triggerElement}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Sala</DialogTitle>
            <DialogDescription>Cadastrar em {locationLabel}. A sala é inserida automaticamente na primeira célula livre do mapa.</DialogDescription>
          </DialogHeader>

          <View className="gap-4">
            <View>
              <Label>
                <Home size={14} color="#243b5d" />
                Nome da Sala *
              </Label>
              <Input placeholder="Ex: Sala 107" value={name} onChangeText={setName} />
            </View>

            <View className="flex-row gap-4">
              <View className="flex-1">
                <Label>Capacidade *</Label>
                <Input placeholder="Ex: 30" keyboardType="number-pad" value={capacity} onChangeText={setCapacity} />
              </View>
              <View className="flex-1">
                <Label>Tipo *</Label>
                <Select value={type} onValueChange={setType} options={TYPE_OPTIONS} placeholder="Selecione" title="Tipo de sala" />
              </View>
            </View>

            <View>
              <Label>Equipamentos Disponíveis</Label>
              <Input placeholder="Ex: Projetor, Computador, Quadro Digital" value={equipment} onChangeText={setEquipment} />
            </View>
          </View>

          <DialogFooter>
            <Button variant="outline" onPress={() => setOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button onPress={handleSubmit} loading={submitting} className="flex-1">
              Cadastrar Sala
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
