import { http } from './http';

export interface Livro {
  id: number;
  titulo: string;
  autor: string;
  anoPublicacao: number;
  quantidadeDisponivel: number;
  emprestimos?: any[];
}

export interface LivroCreatePayload {
  Titulo: string;
  Autor: string;
  AnoPublicacao: number;
  QuantidadeDisponivel: number;
}

export interface LivroUpdatePayload {
  Titulo: string;
  Autor: string;
  AnoPublicacao: number;
}

export async function getLivros(): Promise<Livro[]> {
  const { data } = await http.get('/api/Livro');
  return data;
}

export async function getLivroById(id: number): Promise<Livro> {
  const { data } = await http.get(`/api/Livro/${id}`);
  return data;
}

export async function getLivrosDisponiveis(): Promise<Livro[]> {
  const { data } = await http.get('/api/Livro/disponiveis');
  return data;
}

export async function cadastrarLivro(payload: LivroCreatePayload): Promise<Livro> {
  const { data } = await http.post('/api/Livro', payload);
  return data;
}

export async function updateLivro(id: number, payload: LivroUpdatePayload): Promise<void> {
  await http.put(`/api/Livro/${id}`, payload);
}

export async function deleteLivro(id: number): Promise<void> {
  await http.delete(`/api/Livro/${id}`);
}