import { Pencil, Plus, Trash2, X } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import { createUser, deleteUser, listUsers, updateUser, type Usuario } from '@/data/usersApi';

const TIPO_OPTIONS = [
  { label: 'Administrador', value: 'admin' },
  { label: 'Coordenador', value: 'coordenador' },
  { label: 'Professor', value: 'professor' },
  { label: 'Aluno', value: 'aluno' },
];

const emptyForm = { nome: '', email: '', senha: '', tipo: 'coordenador' };

export default function UsuariosScreen() {
  const [users, setUsers] = useState<Usuario[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [formSaving, setFormSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState(emptyForm);

  const fetchUsers = () => {
    setUsersLoading(true);
    setLoadError('');
    listUsers()
      .then(setUsers)
      .catch(() => setLoadError('Não foi possível carregar os usuários da API.'))
      .finally(() => setUsersLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const stats = useMemo(() => {
    const total = users.length;
    const admins = users.filter((u) => u.tipo === 'admin').length;
    const coordenadores = users.filter((u) => u.tipo === 'coordenador').length;
    return { total, admins, coordenadores };
  }, [users]);

  const openCreate = () => {
    setEditingUser(null);
    setForm(emptyForm);
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (user: Usuario) => {
    setEditingUser(user);
    setForm({ nome: user.nome, email: user.email, senha: '', tipo: user.tipo });
    setFormError('');
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    setDeletingIds((prev) => new Set(prev).add(id));
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id_usuario !== id));
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleSubmit = async () => {
    if (!form.nome.trim() || !form.email.trim() || (!editingUser && !form.senha)) {
      setFormError('Preencha nome, email e senha.');
      return;
    }

    setFormSaving(true);
    setFormError('');
    try {
      if (editingUser) {
        const patch: Partial<typeof form> = { nome: form.nome, email: form.email, tipo: form.tipo };
        if (form.senha) patch.senha = form.senha;
        await updateUser(editingUser.id_usuario, patch);
      } else {
        await createUser(form);
      }
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao salvar usuário');
    } finally {
      setFormSaving(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-100 dark:bg-zinc-950" contentContainerClassName="gap-6 p-4 pb-10">
      <View>
        <Text className="mb-1 text-2xl font-bold text-[#1f3c68]">Gestão de Usuários</Text>
        <Text className="text-sm text-gray-600 dark:text-zinc-400">
          Centralize perfis de acesso, papéis e responsáveis pelo uso das salas.
        </Text>
      </View>

      {/* Estatisticas */}
      <View className="flex-row flex-wrap gap-3">
        <View className="min-w-[30%] flex-1 rounded-xl bg-white p-4 dark:bg-zinc-900" style={{ elevation: 3 }}>
          <Text className="text-xs uppercase tracking-wide text-gray-500 dark:text-zinc-400">Usuários</Text>
          <Text className="mt-2 text-3xl font-bold text-[#1f3c68]">{stats.total}</Text>
        </View>
        <View className="min-w-[30%] flex-1 rounded-xl bg-white p-4 dark:bg-zinc-900" style={{ elevation: 3 }}>
          <Text className="text-xs uppercase tracking-wide text-gray-500 dark:text-zinc-400">Administradores</Text>
          <Text className="mt-2 text-3xl font-bold text-emerald-700">{stats.admins}</Text>
        </View>
        <View className="min-w-[30%] flex-1 rounded-xl bg-white p-4 dark:bg-zinc-900" style={{ elevation: 3 }}>
          <Text className="text-xs uppercase tracking-wide text-gray-500 dark:text-zinc-400">Coordenadores</Text>
          <Text className="mt-2 text-3xl font-bold text-amber-600">{stats.coordenadores}</Text>
        </View>
      </View>

      {/* Lista */}
      <View className="gap-4 rounded-xl bg-white p-5 dark:bg-zinc-900" style={{ elevation: 3 }}>
        <View className="flex-row items-center justify-between">
          <Text className="text-xl font-semibold text-[#1f3c68]">Usuários cadastrados</Text>
          <Button size="sm" onPress={openCreate}>
            <Plus size={14} color="white" />
            Novo
          </Button>
        </View>

        {usersLoading ? (
          <Text className="py-6 text-center text-sm text-gray-400">Carregando usuários...</Text>
        ) : loadError ? (
          <Text className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">{loadError}</Text>
        ) : users.length === 0 ? (
          <Text className="py-6 text-center text-sm text-gray-400">Nenhum usuário cadastrado.</Text>
        ) : (
          <View className="gap-3">
            {users.map((user) => (
              <View key={user.id_usuario} className="gap-2 rounded-lg border border-gray-100 p-4 dark:border-zinc-700">
                <View className="flex-row items-start justify-between gap-2">
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-900 dark:text-zinc-100">{user.nome}</Text>
                    <Text className="text-sm text-gray-600 dark:text-zinc-400">{user.email}</Text>
                  </View>
                  <Badge className="bg-blue-100" textClassName="text-blue-700">
                    {user.tipo}
                  </Badge>
                </View>
                <Text className="text-xs text-gray-500 dark:text-zinc-500">
                  Cadastrado em {new Date(user.created_at).toLocaleDateString('pt-BR')}
                </Text>
                <View className="flex-row gap-2 border-t border-gray-50 pt-3 dark:border-zinc-700">
                  <Pressable
                    onPress={() => openEdit(user)}
                    className="flex-1 flex-row items-center justify-center gap-1.5 rounded-lg bg-blue-50 py-2 dark:bg-blue-900/30">
                    <Pencil size={14} color="#1d4ed8" />
                    <Text className="text-xs font-semibold text-blue-700 dark:text-blue-300">Editar</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => handleDelete(user.id_usuario)}
                    disabled={deletingIds.has(user.id_usuario)}
                    className="flex-1 flex-row items-center justify-center gap-1.5 rounded-lg bg-rose-50 py-2 disabled:opacity-50 dark:bg-rose-900/30">
                    <Trash2 size={14} color="#be123c" />
                    <Text className="text-xs font-semibold text-rose-700 dark:text-rose-300">
                      {deletingIds.has(user.id_usuario) ? 'Excluindo...' : 'Excluir'}
                    </Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      <View className="rounded-xl bg-white p-5 dark:bg-zinc-900" style={{ elevation: 3 }}>
        <Text className="mb-2 text-lg font-semibold text-[#1f3c68] dark:text-blue-300">Regras de permissão</Text>
        <Text className="text-sm text-gray-600 dark:text-zinc-400">
          Administradores podem editar layout e detalhes de sala. Coordenadores validam reservas e servidores registram uso. Mantenha a
          revisão de perfis em ciclo mensal para reduzir riscos operacionais.
        </Text>
      </View>

      {/* Modal criar/editar */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <View className="flex-row items-center justify-between">
              <DialogTitle>{editingUser ? 'Editar usuário' : 'Novo usuário'}</DialogTitle>
              <Pressable onPress={() => setModalOpen(false)}>
                <X size={18} color="#9ca3af" />
              </Pressable>
            </View>
          </DialogHeader>

          <View className="gap-4">
            <View>
              <Label>Nome</Label>
              <Input placeholder="Nome completo" value={form.nome} onChangeText={(text) => setForm((f) => ({ ...f, nome: text }))} />
            </View>
            <View>
              <Label>Email</Label>
              <Input
                placeholder="email@ifms.edu.br"
                autoCapitalize="none"
                keyboardType="email-address"
                value={form.email}
                onChangeText={(text) => setForm((f) => ({ ...f, email: text }))}
              />
            </View>
            <View>
              <Label>{editingUser ? 'Nova senha (opcional)' : 'Senha'}</Label>
              <Input
                placeholder={editingUser ? 'Deixe em branco para manter' : 'Senha'}
                secureTextEntry
                value={form.senha}
                onChangeText={(text) => setForm((f) => ({ ...f, senha: text }))}
              />
            </View>
            <View>
              <Label>Tipo</Label>
              <Select value={form.tipo} onValueChange={(value) => setForm((f) => ({ ...f, tipo: value }))} options={TIPO_OPTIONS} title="Tipo de usuário" />
            </View>

            {formError ? (
              <Text className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{formError}</Text>
            ) : null}
          </View>

          <DialogFooter>
            <Button variant="outline" onPress={() => setModalOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button onPress={handleSubmit} loading={formSaving} className="flex-1">
              {editingUser ? 'Salvar' : 'Cadastrar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ScrollView>
  );
}
