import axios from 'axios';

export const authApi = axios.create({
  baseURL: process.env.EXPO_PUBLIC_HOST_API ?? 'https://api.sigea.fun',
  timeout: 10_000,
});

export interface LoginPayload {
  email: string;
  senha: string;
}

export interface AuthUser {
  id_usuario: number;
  email: string;
  tipo: string;
}

interface LoginApiResponse {
  sucesso: boolean;
  mensagem: string;
  access_token: string;
  token_type: string;
  usuario: AuthUser;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await authApi.post<LoginApiResponse>('/login', payload);
  return { token: data.access_token, user: data.usuario };
}
