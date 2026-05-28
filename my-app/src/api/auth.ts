import { http } from './http';
import { LoginResponse } from './types';

export async function login(email: string, senha: string) {
  const { data } = await http.post<LoginResponse>('/api/Auth/login', { email, senha });
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', data.usuario);
    localStorage.setItem('nome', data.nome);
  return data;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('email');
  localStorage.removeItem('senha');
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem('token'));
}