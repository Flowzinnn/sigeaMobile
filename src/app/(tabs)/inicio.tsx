import { LinearGradient } from 'expo-linear-gradient';
import {
  Building2,
  Clock,
  GraduationCap,
  HelpCircle,
  Info,
  Mail,
  MapPin,
  MapPinned,
  Phone,
  Search,
} from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { ImageWithFallback } from '@/components/ImageWithFallback';
import { RoomMap } from '@/components/RoomMap';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/Accordion';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { Select } from '@/components/ui/Select';
import { useBlocks, useFloorMap } from '@/hooks/useFloorMap';

export default function HomeScreen() {
  const [blockId, setBlockId] = useState('A');
  const [floorId, setFloorId] = useState('A-1');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { blocks } = useBlocks();
  const { floor, loading } = useFloorMap(blockId, floorId);

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

  const selectedRoomDetails = selectedRoomTile?.details;
  const selectedRoomPhoto = selectedRoomDetails?.photoUrl || 'https://www.hojemais.com.br/imagem/noticia/1000/1000/1598047640_62013.jpg';
  const selectedRoomDescription =
    selectedRoomDetails?.description || `${selectedRoom} configurada para atividades acadêmicas e uso diário da comunidade escolar.`;
  const selectedRoomLocation = selectedRoomDetails?.location || `Bloco ${blockId}, ${floor?.name ?? ''}`;
  const selectedRoomDirections =
    selectedRoomDetails?.directions && selectedRoomDetails.directions.length > 0
      ? selectedRoomDetails.directions
      : [
          'Entre pelo portão principal do campus',
          `Siga em direção ao Bloco ${blockId}`,
          'Localize o andar pelas placas de orientação',
          `A ${selectedRoom} fica no corredor principal`,
        ];

  const handleRoomSelect = (roomLabel: string) => {
    setSelectedRoom(roomLabel);
    setIsDialogOpen(true);
  };

  return (
    <>
      <ScrollView className="flex-1 bg-gray-100 dark:bg-zinc-950" contentContainerClassName="gap-6 p-4 pb-10">
        {/* Hero */}
        <LinearGradient colors={['#1f3c68', '#2d5a8f']} style={{ borderRadius: 16, padding: 24 }}>
          <View className="flex-row items-center gap-3">
            <MapPin size={32} color="white" />
            <Text className="flex-1 text-2xl font-bold text-white">Bem-vindo ao IFMS</Text>
          </View>
          <Text className="mt-3 text-base text-blue-100">
            Sistema de Localização de Salas — encontre facilmente onde você precisa estar
          </Text>
          <View className="mt-4 flex-row flex-wrap gap-3">
            <Badge className="bg-green-500">
              <GraduationCap size={14} color="white" />
              Para Calouros
            </Badge>
            <Badge className="bg-blue-500">
              <Info size={14} color="white" />
              Atualizado em tempo real
            </Badge>
          </View>
        </LinearGradient>

        {/* Filtros */}
        <View className="gap-3 rounded-xl bg-white p-4 dark:bg-zinc-900" style={{ elevation: 3 }}>
          <View className="flex-row items-center gap-2">
            <Search size={18} color="#6b7280" />
            <Text className="font-semibold text-gray-700 dark:text-zinc-300">Encontre sua sala:</Text>
          </View>
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Select value={blockId} onValueChange={setBlockId} placeholder="Bloco" options={blocks.map((b) => ({ label: b.name, value: b.id }))} />
            </View>
            <View className="flex-1">
              <Select
                value={floorId}
                onValueChange={setFloorId}
                placeholder="Andar"
                options={(blocks.find((b) => b.id === blockId)?.floors ?? []).map((f) => ({ label: f.name, value: f.id }))}
              />
            </View>
          </View>
        </View>

        {/* Mapa */}
        {loading ? (
          <View className="items-center justify-center gap-3 rounded-xl bg-white p-12 dark:bg-zinc-900" style={{ elevation: 3 }}>
            <Text className="text-gray-400 dark:text-zinc-500">Carregando mapa...</Text>
          </View>
        ) : (
          <RoomMap readOnly floorName={floorLabel} initialGrid={floor?.grid} initialCols={floor?.cols} initialRows={floor?.rows} onRoomSelect={handleRoomSelect} />
        )}

        {/* Informacoes uteis */}
        <View className="gap-4">
          <Card>
            <CardHeader>
              <View className="mb-2 h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <MapPin size={22} color="#2563eb" />
              </View>
              <CardTitle>Localização Fácil</CardTitle>
              <CardDescription>Toque em qualquer sala para ver foto e instruções</CardDescription>
            </CardHeader>
            <CardContent>
              <Text className="text-sm text-gray-600 dark:text-zinc-400">
                Cada sala possui uma imagem ilustrativa e um passo a passo de como chegar até lá.
              </Text>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <View className="mb-2 h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                <Search size={22} color="#16a34a" />
              </View>
              <CardTitle>Busca Rápida</CardTitle>
              <CardDescription>Filtros por bloco e andar</CardDescription>
            </CardHeader>
            <CardContent>
              <Text className="text-sm text-gray-600 dark:text-zinc-400">
                Use os filtros para navegar rapidamente entre os diferentes blocos e andares do campus.
              </Text>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <View className="mb-2 h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Clock size={22} color="#9333ea" />
              </View>
              <CardTitle>Tempo Real</CardTitle>
              <CardDescription>Status atualizado constantemente</CardDescription>
            </CardHeader>
            <CardContent>
              <Text className="text-sm text-gray-600 dark:text-zinc-400">
                Veja em tempo real quais salas estão ocupadas ou disponíveis no momento.
              </Text>
            </CardContent>
          </Card>
        </View>

        {/* Horarios e contatos */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Clock size={18} color="#1f3c68" />
              Horários de Funcionamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <View className="gap-3">
              <View className="flex-row items-center justify-between border-b border-gray-100 pb-2 dark:border-zinc-700">
                <Text className="font-medium text-gray-800 dark:text-zinc-200">Segunda a Sexta</Text>
                <Text className="text-gray-600 dark:text-zinc-400">07:00 - 22:00</Text>
              </View>
              <View className="flex-row items-center justify-between border-b border-gray-100 pb-2 dark:border-zinc-700">
                <Text className="font-medium text-gray-800 dark:text-zinc-200">Sábado</Text>
                <Text className="text-gray-600 dark:text-zinc-400">08:00 - 12:00</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="font-medium text-gray-800 dark:text-zinc-200">Domingo</Text>
                <Text className="text-gray-600 dark:text-zinc-400">Fechado</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <Phone size={18} color="#1f3c68" />
              Informações de Contato
            </CardTitle>
          </CardHeader>
          <CardContent>
            <View className="gap-4">
              <View className="flex-row items-center gap-3">
                <View className="h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Phone size={18} color="#2563eb" />
                </View>
                <View>
                  <Text className="text-sm font-medium text-gray-800 dark:text-zinc-200">Secretaria</Text>
                  <Text className="text-sm text-gray-600 dark:text-zinc-400">(67) 3234-5678</Text>
                </View>
              </View>
              <View className="flex-row items-center gap-3">
                <View className="h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                  <Mail size={18} color="#16a34a" />
                </View>
                <View>
                  <Text className="text-sm font-medium text-gray-800 dark:text-zinc-200">E-mail</Text>
                  <Text className="text-sm text-gray-600 dark:text-zinc-400">contato@ifms.edu.br</Text>
                </View>
              </View>
              <View className="flex-row items-center gap-3">
                <View className="h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <MapPinned size={18} color="#9333ea" />
                </View>
                <View>
                  <Text className="text-sm font-medium text-gray-800 dark:text-zinc-200">Endereço</Text>
                  <Text className="text-sm text-gray-600 dark:text-zinc-400">Av. Principal, 1234 - Centro</Text>
                </View>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              <HelpCircle size={20} color="#1f3c68" />
              Perguntas Frequentes
            </CardTitle>
            <CardDescription>Tire suas dúvidas sobre como utilizar o sistema de localização</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion>
              <AccordionItem value="item-1">
                <AccordionTrigger>Como faço para encontrar minha sala de aula?</AccordionTrigger>
                <AccordionContent>
                  Use os filtros de Bloco e Andar para navegar pelo mapa. Toque na sala desejada para ver uma foto do local e instruções
                  detalhadas de como chegar.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>O que significa quando uma sala está "Ocupada"?</AccordionTrigger>
                <AccordionContent>
                  Salas marcadas como "Ocupada" (em vermelho) estão com aulas ou atividades em andamento. Salas "Disponíveis" (em verde)
                  estão livres no momento.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Como sei em qual bloco fica minha sala?</AccordionTrigger>
                <AccordionContent>
                  O número da sala indica o bloco e andar. Por exemplo, "Sala 201" significa: 2º andar (primeiro dígito), sala 01.
                  Consulte seu horário de aulas ou use os filtros para explorar.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>Posso fazer reserva de sala por este sistema?</AccordionTrigger>
                <AccordionContent>
                  Esta é a área de visualização para estudantes. Para fazer reservas, entre na aba "Reservas" com suas credenciais de
                  funcionário.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>O mapa é atualizado em tempo real?</AccordionTrigger>
                <AccordionContent>
                  Sim! O status das salas (disponível/ocupada) é atualizado automaticamente conforme as reservas e aulas agendadas no
                  sistema.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Estatisticas */}
        <View className="flex-row flex-wrap gap-3">
          <View className="min-w-[45%] flex-1 rounded-xl bg-white p-5 dark:bg-zinc-900" style={{ elevation: 3 }}>
            <Text className="text-center text-3xl font-bold text-[#1f3c68]">3</Text>
            <Text className="text-center text-sm text-gray-600 dark:text-zinc-400">Blocos</Text>
          </View>
          <View className="min-w-[45%] flex-1 rounded-xl bg-white p-5 dark:bg-zinc-900" style={{ elevation: 3 }}>
            <Text className="text-center text-3xl font-bold text-green-600">48</Text>
            <Text className="text-center text-sm text-gray-600 dark:text-zinc-400">Salas de Aula</Text>
          </View>
          <View className="min-w-[45%] flex-1 rounded-xl bg-white p-5 dark:bg-zinc-900" style={{ elevation: 3 }}>
            <Text className="text-center text-3xl font-bold text-blue-600">12</Text>
            <Text className="text-center text-sm text-gray-600 dark:text-zinc-400">Laboratórios</Text>
          </View>
          <View className="min-w-[45%] flex-1 rounded-xl bg-white p-5 dark:bg-zinc-900" style={{ elevation: 3 }}>
            <Text className="text-center text-3xl font-bold text-purple-600">6</Text>
            <Text className="text-center text-sm text-gray-600 dark:text-zinc-400">Auditórios</Text>
          </View>
        </View>

        {/* Dicas para calouros */}
        <Card className="border-2 border-green-200 dark:border-zinc-700">
          <CardHeader>
            <CardTitle className="text-xl text-[#1f3c68]">
              <GraduationCap size={20} color="#1f3c68" />
              Dicas para Calouros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <View className="gap-4">
              {[
                { n: 1, color: 'bg-green-600', title: 'Chegue com antecedência', text: 'Nos primeiros dias, chegue 15 minutos antes para se familiarizar com o caminho.' },
                { n: 2, color: 'bg-green-600', title: 'Use o mapa interativo', text: 'Explore todas as salas antes das aulas começarem para não se perder.' },
                { n: 3, color: 'bg-blue-600', title: 'Pontos de referência', text: 'Biblioteca fica no Bloco A, Cantina no térreo do Bloco B.' },
                { n: 4, color: 'bg-blue-600', title: 'Salve nos favoritos', text: 'Adicione este app aos favoritos para acesso rápido.' },
              ].map((tip) => (
                <View key={tip.n} className="flex-row gap-3">
                  <View className={`h-8 w-8 items-center justify-center rounded-full ${tip.color}`}>
                    <Text className="font-bold text-white">{tip.n}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="mb-1 font-semibold text-gray-900 dark:text-zinc-100">{tip.title}</Text>
                    <Text className="text-sm text-gray-600 dark:text-zinc-400">{tip.text}</Text>
                  </View>
                </View>
              ))}
            </View>
          </CardContent>
        </Card>

        {/* Footer */}
        <View className="rounded-xl bg-[#1f3c68] p-6">
          <Text className="text-center text-sm text-blue-100">© 2026 Instituto Federal de Mato Grosso do Sul - IFMS</Text>
          <Text className="mt-2 text-center text-xs text-blue-200">Desenvolvido pela Equipe de Tecnologia do TADS 3 e 4</Text>
        </View>
      </ScrollView>

      {/* Dialog com detalhes da sala */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl">
              <MapPin size={20} color="#1f3c68" />
              {selectedRoom}
            </DialogTitle>
          </DialogHeader>

          <View className="h-48 overflow-hidden rounded-lg bg-gray-200">
            <ImageWithFallback src={selectedRoomPhoto} className="h-full w-full" resizeMode="cover" />
          </View>

          <Text className="mt-4 text-sm text-gray-600">{selectedRoomDescription}</Text>

          <View className="mt-3 flex-row items-center gap-2">
            <View className="h-2 w-2 rounded-full bg-green-600" />
            <Text className="font-semibold text-gray-700">Localização:</Text>
            <Text className="text-gray-700">{selectedRoomLocation}</Text>
          </View>

          <View className="mt-3 border-t border-gray-100 pt-3">
            <Text className="mb-2 font-semibold text-gray-900">Como chegar:</Text>
            {selectedRoomDirections.map((step, index) => (
              <Text key={index} className="text-sm text-gray-600">
                {index + 1}. {step}
              </Text>
            ))}
          </View>
        </DialogContent>
      </Dialog>
    </>
  );
}
