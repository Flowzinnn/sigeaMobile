import { Plus } from 'lucide-react-native';
import { cloneElement, useState, type ReactElement } from 'react';
import { Alert, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { DateTimeField } from '@/components/ui/DateTimeField';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import { createReservation } from '@/data/reservationsApi';

interface NewReservationDialogProps {
  trigger?: ReactElement;
  defaultRoom?: string;
  onCreated?: () => void;
}

const ROOM_OPTIONS = [
  { label: 'Sala 101 - 25 lugares', value: '101' },
  { label: 'Sala 102 - 30 lugares', value: '102' },
  { label: 'Sala 103 - 35 lugares', value: '103' },
  { label: 'Sala 104 - 25 lugares', value: '104' },
  { label: 'Sala 105 - 30 lugares', value: '105' },
  { label: 'Sala 106 - 35 lugares', value: '106' },
];

export function NewReservationDialog({ trigger, defaultRoom, onCreated }: NewReservationDialogProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [room, setRoom] = useState(defaultRoom ?? '');
  const [date, setDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [responsible, setResponsible] = useState('');
  const [purpose, setPurpose] = useState('');

  const reset = () => {
    setRoom(defaultRoom ?? '');
    setDate(null);
    setStartTime(null);
    setEndTime(null);
    setResponsible('');
    setPurpose('');
  };

  const handleSubmit = async () => {
    if (!room || !date || !startTime || !endTime || !responsible.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha sala, data, horários e responsável.');
      return;
    }

    setSubmitting(true);
    try {
      await createReservation({
        room: `Sala ${room}`,
        date: date.toLocaleDateString('pt-BR'),
        startTime: startTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        endTime: endTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        responsible: responsible.trim(),
      });
      setOpen(false);
      reset();
      onCreated?.();
    } finally {
      setSubmitting(false);
    }
  };

  const triggerElement = trigger ? (
    cloneElement(trigger, { onPress: () => setOpen(true) } as Record<string, unknown>)
  ) : (
    <Button onPress={() => setOpen(true)} className="bg-green-700 active:bg-green-800">
      <Plus size={16} color="white" />
      Nova Reserva
    </Button>
  );

  return (
    <>
      {triggerElement}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Reserva</DialogTitle>
            <DialogDescription>Preencha os dados abaixo para criar uma nova reserva de sala.</DialogDescription>
          </DialogHeader>

          <View className="gap-4">
            <View>
              <Label>Sala *</Label>
              <Select value={room} onValueChange={setRoom} options={ROOM_OPTIONS} placeholder="Selecione uma sala" title="Sala" />
            </View>

            <View>
              <Label>Data *</Label>
              <DateTimeField mode="date" value={date} onChange={setDate} placeholder="Selecione a data" />
            </View>

            <View className="flex-row gap-4">
              <View className="flex-1">
                <Label>Início *</Label>
                <DateTimeField mode="time" value={startTime} onChange={setStartTime} placeholder="--:--" />
              </View>
              <View className="flex-1">
                <Label>Fim *</Label>
                <DateTimeField mode="time" value={endTime} onChange={setEndTime} placeholder="--:--" />
              </View>
            </View>

            <View>
              <Label>Responsável *</Label>
              <Input placeholder="Nome do responsável" value={responsible} onChangeText={setResponsible} />
            </View>

            <View>
              <Label>Finalidade</Label>
              <Input placeholder="Ex: Aula de Matemática, Reunião, etc." value={purpose} onChangeText={setPurpose} />
            </View>
          </View>

          <DialogFooter>
            <Button variant="outline" onPress={() => setOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button onPress={handleSubmit} loading={submitting} className="flex-1 bg-green-700 active:bg-green-800">
              Criar Reserva
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
