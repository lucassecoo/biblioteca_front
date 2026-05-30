import { http } from './http';
import { LoginResponse } from './types';

export async function login(email: string, senha: string) {
  const { data } = await http.post('/api/Auth/login', { email, senha });
  localStorage.setItem('token', data.token);
  localStorage.setItem('nome', data.nome ?? data.usuario ?? email);
  return data;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('nome');
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem('token'));
}