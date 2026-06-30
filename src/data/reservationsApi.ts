export type ReservationStatus = 'Ativa' | 'Concluida' | 'Cancelada';

export interface RecentReservation {
  id: number | string;
  room: string;
  date: string;
  time: string;
  responsible: string;
  avatar: string;
  status: ReservationStatus;
}

export const defaultRecentReservations: RecentReservation[] = [
  {
    id: 1,
    room: 'Sala 102',
    date: 'Hoje',
    time: '14:00 - 15:00',
    responsible: 'Joao Silva',
    avatar: 'JS',
    status: 'Ativa',
  },
  {
    id: 2,
    room: 'Sala 205',
    date: '23/04/2026',
    time: '10:00 - 12:00',
    responsible: 'Joao Flores',
    avatar: 'JF',
    status: 'Ativa',
  },
  {
    id: 3,
    room: 'Sala 101',
    date: '23/04/2026',
    time: '08:00 - 09:30',
    responsible: 'Maria Souza',
    avatar: 'MS',
    status: 'Concluida',
  },
  {
    id: 4,
    room: 'Sala 106',
    date: '19/04/2026',
    time: '16:00 - 17:30',
    responsible: 'Paula Lima',
    avatar: 'PL',
    status: 'Ativa',
  },
  {
    id: 5,
    room: 'Sala 103',
    date: '19/04/2026',
    time: '10:00 - 11:00',
    responsible: 'Carlos Nunes',
    avatar: 'CN',
    status: 'Cancelada',
  },
];

// Estado em memoria (substitui a "tabela" de reservas ate existir backend real).
// Comeca com os valores padrao e e mutado pelas operacoes de CRUD abaixo, para que
// reservas criadas/editadas/excluidas na sessao permanecam visiveis entre telas.
let reservationsStore: RecentReservation[] = defaultRecentReservations.map(r => ({ ...r }));

const RECENT_RESERVATIONS_ENDPOINT =
  'https://api-reservas.ifms.dev/v1/reservations/recent';
const API_TIMEOUT_MS = 3500;

type ApiReservation = {
  id?: number | string;
  room?: string;
  sala?: string;
  date?: string;
  data?: string;
  startTime?: string;
  endTime?: string;
  horario?: string;
  responsible?: string;
  responsavel?: string;
  status?: string;
};

function withTimeout(url: string, timeoutMs: number) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(timeout));
}

function toAvatar(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map(part => part[0]?.toUpperCase() ?? '').join('') || 'IF';
}

function normalizeStatus(status: unknown): ReservationStatus {
  const value = String(status ?? '').trim().toLowerCase();

  if (['concluida', 'finished', 'completed', 'done'].includes(value)) {
    return 'Concluida';
  }

  if (['cancelada', 'cancelado', 'canceled', 'cancelled'].includes(value)) {
    return 'Cancelada';
  }

  return 'Ativa';
}

function normalizeDate(input: unknown): string {
  if (!input) return 'Hoje';

  const raw = String(input).trim();
  const parsed = new Date(raw);

  if (Number.isNaN(parsed.getTime())) {
    return raw;
  }

  const today = new Date();
  const isToday =
    today.getDate() === parsed.getDate() &&
    today.getMonth() === parsed.getMonth() &&
    today.getFullYear() === parsed.getFullYear();

  if (isToday) {
    return 'Hoje';
  }

  return new Intl.DateTimeFormat('pt-BR').format(parsed);
}

function normalizeTime(apiReservation: ApiReservation): string {
  if (apiReservation.horario && apiReservation.horario.trim()) {
    return apiReservation.horario;
  }

  if (apiReservation.startTime && apiReservation.endTime) {
    return `${apiReservation.startTime} - ${apiReservation.endTime}`;
  }

  return '--:-- - --:--';
}

function mapFromApi(item: ApiReservation, index: number): RecentReservation | null {
  const room = item.room ?? item.sala;
  if (!room) {
    return null;
  }

  const responsible = item.responsible ?? item.responsavel ?? 'Nao informado';

  return {
    id: item.id ?? `api-${index}`,
    room,
    date: normalizeDate(item.date ?? item.data),
    time: normalizeTime(item),
    responsible,
    avatar: toAvatar(responsible),
    status: normalizeStatus(item.status),
  };
}

function extractApiRows(payload: unknown): ApiReservation[] {
  if (Array.isArray(payload)) {
    return payload as ApiReservation[];
  }

  if (payload && typeof payload === 'object' && 'data' in payload) {
    const maybeRows = (payload as { data?: unknown }).data;
    if (Array.isArray(maybeRows)) {
      return maybeRows as ApiReservation[];
    }
  }

  return [];
}

/** Le a lista de reservas recentes: tenta a API externa, senão usa o estado local. */
export async function getRecentReservations(): Promise<{
  reservations: RecentReservation[];
  source: 'api' | 'default';
}> {
  try {
    const response = await withTimeout(RECENT_RESERVATIONS_ENDPOINT, API_TIMEOUT_MS);
    if (!response.ok) {
      throw new Error(`Falha HTTP ${response.status}`);
    }

    const payload = (await response.json()) as unknown;
    const rows = extractApiRows(payload)
      .map((item, index) => mapFromApi(item, index))
      .filter((item): item is RecentReservation => item !== null)
      .slice(0, 8);

    if (rows.length === 0) {
      throw new Error('Resposta da API sem reservas validas.');
    }

    reservationsStore = rows;
    return { reservations: rows, source: 'api' };
  } catch {
    return { reservations: reservationsStore, source: 'default' };
  }
}

// ─── CRUD local de reservas ──────────────────────────────────────────

export interface CreateReservationInput {
  room: string;
  date: string;
  startTime: string;
  endTime: string;
  responsible: string;
}

function delay<T>(value: T, ms = 150): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(value), ms));
}

/** Cria uma nova reserva (aparece imediatamente na lista de "Reservas Recentes") */
export async function createReservation(input: CreateReservationInput): Promise<RecentReservation> {
  const reservation: RecentReservation = {
    id: `local-${Date.now()}`,
    room: input.room,
    date: input.date || 'Hoje',
    time: `${input.startTime} - ${input.endTime}`,
    responsible: input.responsible,
    avatar: toAvatar(input.responsible),
    status: 'Ativa',
  };

  reservationsStore = [reservation, ...reservationsStore];
  return delay(reservation);
}

/** Atualiza o status de uma reserva existente (ex: concluir ou cancelar) */
export async function updateReservationStatus(
  id: RecentReservation['id'],
  status: ReservationStatus
): Promise<RecentReservation | null> {
  const index = reservationsStore.findIndex(r => r.id === id);
  if (index === -1) return delay(null);

  reservationsStore[index] = { ...reservationsStore[index], status };
  return delay(reservationsStore[index]);
}

/** Remove uma reserva da lista */
export async function deleteReservation(id: RecentReservation['id']): Promise<void> {
  reservationsStore = reservationsStore.filter(r => r.id !== id);
  return delay(undefined);
}
