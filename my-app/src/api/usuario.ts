import { http } from './http';

export async function cadastrarUsuario(payload: {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
}) {
  await http.post('/api/Usuarios', payload);
}