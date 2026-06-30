export interface Usuario {
  id_usuario: number;
  nome: string;
  email: string;
  tipo: string;
  created_at: string;
}

export interface UsuarioInput {
  nome: string;
  email: string;
  senha?: string;
  tipo: string;
}

// Estado em memoria (dados de teste) - substituir pela API real de usuarios quando integrada.
let usersStore: Usuario[] = [
  { id_usuario: 1, nome: 'Visitante IFMS', email: 'visitante@ifms.edu.br', tipo: 'coordenador', created_at: '2026-01-10T09:00:00Z' },
  { id_usuario: 2, nome: 'Ana Beatriz Ramos', email: 'ana.ramos@ifms.edu.br', tipo: 'admin', created_at: '2026-01-15T11:30:00Z' },
  { id_usuario: 3, nome: 'Carlos Eduardo Souza', email: 'carlos.souza@ifms.edu.br', tipo: 'admin', created_at: '2026-02-02T14:20:00Z' },
  { id_usuario: 4, nome: 'Fernanda Lopes Martins', email: 'fernanda.martins@ifms.edu.br', tipo: 'coordenador', created_at: '2026-02-10T08:45:00Z' },
  { id_usuario: 5, nome: 'Juliana Costa Pereira', email: 'juliana.pereira@ifms.edu.br', tipo: 'coordenador', created_at: '2026-03-01T16:10:00Z' },
  { id_usuario: 6, nome: 'Rafael Henrique Alves', email: 'rafael.alves@ifms.edu.br', tipo: 'professor', created_at: '2026-03-12T10:05:00Z' },
  { id_usuario: 7, nome: 'Bruna Oliveira Santos', email: 'bruna.santos@ifms.edu.br', tipo: 'professor', created_at: '2026-04-03T13:40:00Z' },
  { id_usuario: 8, nome: 'Lucas Gabriel Ferreira', email: 'lucas.ferreira@aluno.ifms.edu.br', tipo: 'aluno', created_at: '2026-04-20T09:15:00Z' },
  { id_usuario: 9, nome: 'Marina Dias Cardoso', email: 'marina.cardoso@aluno.ifms.edu.br', tipo: 'aluno', created_at: '2026-05-05T15:25:00Z' },
  { id_usuario: 10, nome: 'Pedro Henrique Nogueira', email: 'pedro.nogueira@aluno.ifms.edu.br', tipo: 'aluno', created_at: '2026-05-18T11:00:00Z' },
];

let nextId = usersStore.length + 1;

function delay<T>(value: T, ms = 150): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

/** Lista usuarios cadastrados */
export async function listUsers(): Promise<Usuario[]> {
  return delay([...usersStore]);
}

/** Cria um novo usuario */
export async function createUser(input: UsuarioInput): Promise<void> {
  const user: Usuario = {
    id_usuario: nextId++,
    nome: input.nome,
    email: input.email,
    tipo: input.tipo,
    created_at: new Date().toISOString(),
  };
  usersStore = [user, ...usersStore];
  await delay(undefined);
}

/** Atualiza dados de um usuario existente */
export async function updateUser(id: number, input: Partial<UsuarioInput>): Promise<void> {
  usersStore = usersStore.map((u) => (u.id_usuario === id ? { ...u, ...input } : u));
  await delay(undefined);
}

/** Remove um usuario */
export async function deleteUser(id: number): Promise<void> {
  usersStore = usersStore.filter((u) => u.id_usuario !== id);
  await delay(undefined);
}
