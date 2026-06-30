import { isAxiosError } from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { LogIn } from 'lucide-react-native';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';

import { LogoMark } from '@/components/LogoMark';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { useAuth } from '@/contexts/AuthContext';

const authDefaults = {
  email: 'visitante@ifms.edu.br',
  senha: 'senha123',
};

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState(authDefaults.email);
  const [password, setPassword] = useState(authDefaults.senha);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async () => {
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Informe e-mail e senha para continuar.');
      return;
    }

    setLoading(true);
    try {
      await login({ email, senha: password }, rememberMe);
      router.replace('/(tabs)/inicio');
    } catch (err) {
      if (isAxiosError(err)) {
        const status = err.response?.status;
        if (status === 401 || status === 403) {
          setErrorMessage('E-mail ou senha incorretos.');
        } else if (status && status >= 500) {
          setErrorMessage('Erro no servidor. Tente novamente em instantes.');
        } else if (err.code === 'ECONNABORTED' || !err.response) {
          setErrorMessage('Não foi possível conectar ao servidor. Verifique sua conexão.');
        } else {
          setErrorMessage('Ocorreu um erro inesperado. Tente novamente.');
        }
      } else {
        setErrorMessage('Ocorreu um erro inesperado. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#f6f9ff', '#eef4ff', '#eefaf3']} style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerClassName="flex-1 items-center justify-center px-4 py-10" keyboardShouldPersistTaps="handled">
          <View
            className="w-full max-w-lg rounded-3xl border border-white/70 bg-white/90 p-6 dark:border-zinc-700/50 dark:bg-zinc-900/90"
            style={{ elevation: 6 }}>
            <View className="mb-8 flex-row items-center gap-4">
              <LogoMark size={64} />
              <View className="flex-1">
                <Text className="text-xs uppercase tracking-widest text-[#45618a] dark:text-blue-400">Acesso seguro</Text>
                <Text className="text-3xl font-semibold text-[#1a2f4f] dark:text-white">Login IFMS</Text>
              </View>
            </View>

            <Text className="mb-6 text-sm text-[#5f6d82] dark:text-zinc-400">
              Tela preparada para autenticação com API externa. Os campos já iniciam com valores default para facilitar testes.
            </Text>

            <View className="gap-5">
              <View>
                <Label>E-mail institucional</Label>
                <Input
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholder="seu.email@ifms.edu.br"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <View>
                <Label>Senha</Label>
                <Input secureTextEntry placeholder="••••••••" value={password} onChangeText={setPassword} />
              </View>

              <Pressable className="flex-row items-center gap-2" onPress={() => setRememberMe((v) => !v)}>
                <Checkbox checked={rememberMe} onCheckedChange={setRememberMe} />
                <Text className="text-sm text-[#4e6078] dark:text-zinc-400">Manter sessão ativa</Text>
              </Pressable>

              <Button onPress={handleSubmit} loading={loading} className="h-12">
                <LogIn size={18} color="white" />
                {loading ? 'Autenticando...' : 'Entrar com conta IFMS'}
              </Button>

              {errorMessage ? (
                <Text className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">{errorMessage}</Text>
              ) : null}
            </View>

            <Text className="mt-6 text-xs leading-relaxed text-[#5f6d82] dark:text-zinc-500">
              Ao autenticar, a aplicação utilizará o endpoint padrão configurado nesta tela até a API oficial ser integrada.
            </Text>
          </View>

          <Text className="mt-6 text-center text-xs text-[#5f6d82] dark:text-zinc-500">
            © 2026 Instituto Federal de Mato Grosso do Sul
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
