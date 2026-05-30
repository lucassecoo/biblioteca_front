import { http } from './http';

export async function cadastrarUsuario(payload: {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  }) {
  await http.post('/api/Usuarios', payload);
}

export async function getUsuarios() {
  const { data } = await http.get('/api/Usuarios');
  return data;
}

export async function deleteUsuario(id: number) {
  await http.delete(`/api/Usuarios/${id}`);
}

export async function updateUsuario(id: number, payload: { Nome: string; Email: string }) {
  await http.put(`/api/Usuarios/${id}`, payload);
}

export async function getUsuarioById(id: number) {
  const response = await http.get(`/api/Usuarios/${id}`);
  return response.data;
}

export function getUserId() {
  const token = localStorage.getItem('token');

  if (!token) return null;

  const payload = JSON.parse(
      atob(token.split('.')[1])
  );

  return payload[
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
  ];
}

export function getUserRole() {
  const token = localStorage.getItem('token');

  if (!token) return null;

  const payload = JSON.parse(
      atob(token.split('.')[1])
  );

  return payload[
      'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
  ];
}