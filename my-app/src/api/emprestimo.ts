import { http } from './http';

export interface Emprestimo {
  id: number;

  usuarioId: number;
  livroId: number

  nomeUsuario: string;
  tituloLivro: string;
  dataEmprestimo: string;
  dataDevolucaoPrevista: string;
  dataDevolucao?: string;
  status: string;
}

export interface EmprestimoCreatePayload {
  usuarioId: number;
  livroId: number;
}

export async function getEmprestimos(): Promise<Emprestimo[]> {
  const { data } = await http.get('/api/Emprestimo');
  return data;
}

export async function getEmprestimoById(id: number): Promise<Emprestimo> {
  const { data } = await http.get(`/api/Emprestimo/${id}`);
  return data;
}

export async function registrarEmprestimo(
  payload: EmprestimoCreatePayload
): Promise<Emprestimo> {
  const { data } = await http.post('/api/Emprestimo', payload);
  return data;
}

export async function devolverEmprestimo(
  usuarioId: number,
  emprestimoId: number
): Promise<void> {
  await http.patch(
    `/api/Emprestimo/usuarios/${usuarioId}/emprestimos/${emprestimoId}/devolver`
  );
}

export async function deleteEmprestimo(
  id: number
): Promise<void> {
  await http.delete(
    `/api/Emprestimo/${id}`
  );
}

