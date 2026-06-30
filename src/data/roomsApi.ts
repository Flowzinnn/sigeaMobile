// ─── Types ─────────────────────────────────────────────────────────
export type TileType = 'room' | 'corridor' | 'bathroom' | 'stairs' | 'entrance' | 'wall';
export type RoomStatus = 'available' | 'occupied' | 'maintenance';

export interface RoomReservation {
  date: string;
  time: string;
  user: string;
}

export interface RoomDetails {
  photoUrl?: string;
  description?: string;
  location?: string;
  directions?: string[];
}

export interface Tile {
  type: TileType;
  label?: string;
  status?: RoomStatus;
  capacity?: number;
  category?: string;
  reservations?: RoomReservation[];
  details?: RoomDetails;
}

export type GridData = Record<string, Tile>; // key: "row-col"

export interface FloorLayout {
  id: string;
  name: string;
  cols: number;
  rows: number;
  grid: GridData;
}

export interface Block {
  id: string;
  name: string;
  floors: FloorLayout[];
}

// ─── Mock Database ──────────────────────────────────────────────────
// Simula um banco de dados em memoria - substituir pelas chamadas reais a API
let mockBlocks: Block[] = [
  {
    id: 'A',
    name: 'Bloco A',
    floors: [
      {
        id: 'A-0',
        name: 'Terreo',
        cols: 6,
        rows: 3,
        grid: {
          '0-0': { type: 'entrance', label: 'Entrada Principal' },
          '0-1': { type: 'corridor' },
          '0-2': { type: 'corridor' },
          '0-3': { type: 'corridor' },
          '0-4': { type: 'bathroom', label: 'Banheiro M' },
          '0-5': { type: 'bathroom', label: 'Banheiro F' },
          '1-0': { type: 'room', label: 'Secretaria', status: 'available' },
          '1-1': { type: 'room', label: 'Coordenacao', status: 'occupied' },
          '1-2': { type: 'room', label: 'Sala de Reuniao', status: 'available' },
          '1-3': { type: 'room', label: 'Biblioteca', status: 'available' },
          '1-4': { type: 'stairs', label: 'Escada' },
          '2-0': { type: 'room', label: 'Lab. Informatica 1', status: 'occupied' },
          '2-1': {
            type: 'room',
            label: 'Lab. Informatica 2',
            status: 'available',
            capacity: 30,
            category: 'Laboratorio',
            details: {
              photoUrl: 'https://www.hojemais.com.br/imagem/noticia/1000/1000/1598047640_62013.jpg',
              description: 'Laboratorio de informatica com estacoes para aulas praticas e atividades de desenvolvimento.',
              location: 'Bloco A, Terreo',
              directions: [
                'Entre pelo portao principal do campus',
                'Siga em direcao ao Bloco A',
                'A sala esta no terreo, proxima a entrada do bloco',
                'A Lab. Informatica 2 fica no corredor a direita',
              ],
            },
          },
          '2-2': { type: 'room', label: 'Lab. Eletronica', status: 'maintenance' },
          '2-3': { type: 'room', label: 'Deposito', status: 'available' },
        },
      },
      {
        id: 'A-1',
        name: '1º Andar',
        cols: 7,
        rows: 4,
        grid: {
          '0-0': { type: 'room', label: 'Sala 101', status: 'available' },
          '0-1': {
            type: 'room',
            label: 'Sala 102',
            status: 'occupied',
            capacity: 30,
            category: 'Sala comum',
            reservations: [
              {
                date: 'Hoje',
                time: '14:00 - 15:00',
                user: 'João Silva',
              },
            ],
            details: {
              photoUrl: 'https://www.hojemais.com.br/imagem/noticia/1000/1000/1598047640_62013.jpg',
              description: 'Sala para aulas regulares, equipada com projetor e quadro branco.',
              location: 'Bloco A, 1º Andar',
              directions: [
                'Entre pelo portao principal do campus',
                'Siga em direcao ao Bloco A',
                'Suba para o 1º Andar pelas escadas ou elevador',
                'A Sala 102 fica no corredor principal',
              ],
            },
          },
          '0-2': { type: 'room', label: 'Sala 103', status: 'available' },
          '0-3': { type: 'room', label: 'Sala 104', status: 'available' },
          '0-4': { type: 'room', label: 'Sala 105', status: 'occupied' },
          '0-5': { type: 'bathroom', label: 'Banheiro M' },
          '0-6': { type: 'bathroom', label: 'Banheiro F' },
          '1-0': { type: 'corridor' },
          '1-1': { type: 'corridor' },
          '1-2': { type: 'corridor' },
          '1-3': { type: 'corridor' },
          '1-4': { type: 'corridor' },
          '1-5': { type: 'corridor' },
          '1-6': { type: 'stairs', label: 'Escada' },
          '2-0': { type: 'room', label: 'Sala 106', status: 'available' },
          '2-1': { type: 'room', label: 'Sala 107', status: 'maintenance' },
          '2-2': { type: 'room', label: 'Sala 108', status: 'occupied' },
          '2-3': { type: 'room', label: 'Sala 109', status: 'available' },
          '2-4': { type: 'room', label: 'Sala 110', status: 'available' },
          '3-0': { type: 'wall' },
          '3-6': { type: 'wall' },
        },
      },
      {
        id: 'A-2',
        name: '2º Andar',
        cols: 7,
        rows: 4,
        grid: {
          '0-0': { type: 'room', label: 'Sala 201', status: 'available' },
          '0-1': { type: 'room', label: 'Sala 202', status: 'available' },
          '0-2': { type: 'room', label: 'Sala 203', status: 'occupied' },
          '0-3': { type: 'room', label: 'Sala 204', status: 'available' },
          '0-4': { type: 'room', label: 'Sala 205', status: 'available' },
          '0-5': { type: 'bathroom', label: 'Banheiro M' },
          '0-6': { type: 'bathroom', label: 'Banheiro F' },
          '1-0': { type: 'corridor' },
          '1-1': { type: 'corridor' },
          '1-2': { type: 'corridor' },
          '1-3': { type: 'corridor' },
          '1-4': { type: 'corridor' },
          '1-5': { type: 'corridor' },
          '1-6': { type: 'stairs', label: 'Escada' },
          '2-0': { type: 'room', label: 'Sala 206', status: 'available' },
          '2-1': { type: 'room', label: 'Sala 207', status: 'occupied' },
          '2-2': { type: 'room', label: 'Sala 208', status: 'available' },
          '2-3': { type: 'room', label: 'Sala 209', status: 'maintenance' },
          '2-4': { type: 'room', label: 'Sala 210', status: 'available' },
        },
      },
    ],
  },
  {
    id: 'B',
    name: 'Bloco B',
    floors: [
      {
        id: 'B-0',
        name: 'Terreo',
        cols: 5,
        rows: 3,
        grid: {
          '0-0': { type: 'entrance', label: 'Entrada' },
          '0-1': { type: 'corridor' },
          '0-2': { type: 'corridor' },
          '0-3': { type: 'bathroom', label: 'Banheiro M' },
          '0-4': { type: 'bathroom', label: 'Banheiro F' },
          '1-0': { type: 'room', label: 'Cantina', status: 'available' },
          '1-1': { type: 'room', label: 'Reprografia', status: 'available' },
          '1-2': { type: 'room', label: 'Sala de Professores', status: 'occupied' },
          '1-3': { type: 'stairs', label: 'Escada' },
          '2-0': { type: 'room', label: 'Lab. Quimica', status: 'available' },
          '2-1': { type: 'room', label: 'Lab. Fisica', status: 'maintenance' },
          '2-2': { type: 'room', label: 'Lab. Biologia', status: 'available' },
        },
      },
      {
        id: 'B-1',
        name: '1º Andar',
        cols: 6,
        rows: 3,
        grid: {
          '0-0': { type: 'room', label: 'Sala B101', status: 'available' },
          '0-1': { type: 'room', label: 'Sala B102', status: 'occupied' },
          '0-2': { type: 'room', label: 'Sala B103', status: 'available' },
          '0-3': { type: 'room', label: 'Sala B104', status: 'available' },
          '0-4': { type: 'bathroom', label: 'Banheiro M' },
          '0-5': { type: 'bathroom', label: 'Banheiro F' },
          '1-0': { type: 'corridor' },
          '1-1': { type: 'corridor' },
          '1-2': { type: 'corridor' },
          '1-3': { type: 'corridor' },
          '1-4': { type: 'corridor' },
          '1-5': { type: 'stairs', label: 'Escada' },
          '2-0': { type: 'room', label: 'Sala B105', status: 'maintenance' },
          '2-1': { type: 'room', label: 'Sala B106', status: 'available' },
          '2-2': { type: 'room', label: 'Sala B107', status: 'available' },
          '2-3': { type: 'room', label: 'Sala B108', status: 'occupied' },
        },
      },
    ],
  },
];

// ─── Funcoes da "API" ───────────────────────────────────────────────
// Simulam chamadas HTTP - trocar por fetch/axios quando a API real estiver pronta

function delay<T>(value: T, ms = 150): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(value), ms));
}

function cloneTile(tile: Tile): Tile {
  return {
    ...tile,
    reservations: tile.reservations?.map(reservation => ({ ...reservation })),
    details: tile.details
      ? {
          ...tile.details,
          directions: tile.details.directions ? [...tile.details.directions] : [],
        }
      : undefined,
  };
}

function cloneGrid(grid: GridData): GridData {
  return Object.fromEntries(
    Object.entries(grid).map(([key, tile]) => [key, cloneTile(tile)])
  );
}

function cloneFloor(floor: FloorLayout): FloorLayout {
  return {
    ...floor,
    grid: cloneGrid(floor.grid),
  };
}

function cloneBlock(block: Block): Block {
  return {
    ...block,
    floors: block.floors.map(cloneFloor),
  };
}

/** Lista todos os blocos */
export async function getBlocks(): Promise<Block[]> {
  return delay(mockBlocks.map(cloneBlock));
}

/** Retorna os andares de um bloco */
export async function getFloors(blockId: string): Promise<FloorLayout[]> {
  const block = mockBlocks.find(b => b.id === blockId);
  return delay(block ? block.floors.map(cloneFloor) : []);
}

/** Retorna o layout completo de um andar especifico */
export async function getFloorLayout(blockId: string, floorId: string): Promise<FloorLayout | null> {
  const block = mockBlocks.find(b => b.id === blockId);
  const floor = block?.floors.find(f => f.id === floorId) ?? null;
  return delay(floor ? cloneFloor(floor) : null);
}

/** Salva o layout de um andar (grid, cols, rows) */
export async function saveFloorLayout(
  blockId: string,
  floorId: string,
  patch: Partial<Pick<FloorLayout, 'grid' | 'cols' | 'rows'>>
): Promise<FloorLayout> {
  const block = mockBlocks.find(b => b.id === blockId);
  if (!block) throw new Error(`Bloco ${blockId} não encontrado`);
  const floorIndex = block.floors.findIndex(f => f.id === floorId);
  if (floorIndex === -1) throw new Error(`Andar ${floorId} não encontrado`);

  block.floors[floorIndex] = {
    ...block.floors[floorIndex],
    ...patch,
    grid: patch.grid ? cloneGrid(patch.grid) : block.floors[floorIndex].grid,
  };

  return delay(cloneFloor(block.floors[floorIndex]));
}

/** Atualiza os detalhes dinamicos de uma sala especifica em um andar */
export async function updateRoomDetails(
  blockId: string,
  floorId: string,
  roomLabel: string,
  detailsPatch: RoomDetails
): Promise<FloorLayout | null> {
  const block = mockBlocks.find(b => b.id === blockId);
  if (!block) return delay(null);

  const floor = block.floors.find(f => f.id === floorId);
  if (!floor) return delay(null);

  const roomEntry = Object.entries(floor.grid).find(([, tile]) => (
    tile.type === 'room' && tile.label === roomLabel
  ));

  if (!roomEntry) return delay(null);

  const [cellId, tile] = roomEntry;
  floor.grid[cellId] = {
    ...tile,
    details: {
      ...tile.details,
      ...detailsPatch,
      directions: detailsPatch.directions ?? tile.details?.directions ?? [],
    },
  };

  return delay(cloneFloor(floor));
}

// ─── CRUD de salas (tiles do tipo "room") ───────────────────────────

export interface CreateRoomInput {
  /** Celula alvo "row-col"; se omitida, usa a primeira celula vazia do andar */
  cellId?: string;
  label: string;
  capacity?: number;
  category?: string;
  status?: RoomStatus;
}

function findFirstEmptyCell(floor: FloorLayout): string {
  for (let row = 0; row < floor.rows; row++) {
    for (let col = 0; col < floor.cols; col++) {
      const key = `${row}-${col}`;
      if (!floor.grid[key]) return key;
    }
  }
  // Andar cheio: adiciona uma nova linha
  return `${floor.rows}-0`;
}

/** Cria (insere) uma nova sala no grid de um andar */
export async function createRoom(
  blockId: string,
  floorId: string,
  input: CreateRoomInput
): Promise<FloorLayout> {
  const block = mockBlocks.find(b => b.id === blockId);
  if (!block) throw new Error(`Bloco ${blockId} não encontrado`);
  const floor = block.floors.find(f => f.id === floorId);
  if (!floor) throw new Error(`Andar ${floorId} não encontrado`);

  const cellId = input.cellId ?? findFirstEmptyCell(floor);
  const row = Number(cellId.split('-')[0]);
  if (row >= floor.rows) floor.rows = row + 1;

  floor.grid[cellId] = {
    type: 'room',
    label: input.label,
    status: input.status ?? 'available',
    capacity: input.capacity,
    category: input.category,
  };

  return delay(cloneFloor(floor));
}

/** Remove uma sala (por label) do grid de um andar */
export async function deleteRoom(
  blockId: string,
  floorId: string,
  roomLabel: string
): Promise<FloorLayout> {
  const block = mockBlocks.find(b => b.id === blockId);
  if (!block) throw new Error(`Bloco ${blockId} não encontrado`);
  const floor = block.floors.find(f => f.id === floorId);
  if (!floor) throw new Error(`Andar ${floorId} não encontrado`);

  const entry = Object.entries(floor.grid).find(([, tile]) => (
    tile.type === 'room' && tile.label === roomLabel
  ));
  if (entry) delete floor.grid[entry[0]];

  return delay(cloneFloor(floor));
}
