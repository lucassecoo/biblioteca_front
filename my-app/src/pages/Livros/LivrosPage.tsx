import React, { useEffect, useState } from 'react';
import { getLivros, getLivroById, Livro } from '../../api/livro';
import { getUserRole } from '../../api/usuario';
import { LivroList } from './LivroList';
import { LivroForm } from './LivroForm';

export function LivrosPage() {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [livroSelecionado, setLivroSelecionado] = useState<Livro | null>(null);
  const [mostrarFormCadastro, setMostrarFormCadastro] = useState(false);
  const [loading, setLoading] = useState(false);

  const role = getUserRole();
  const isAdmin = role === 'Admin';

  async function carregarLivros() {
    setLoading(true);
    try {
      const data = await getLivros();
      setLivros(data);
    } catch (err: any) {
      alert(err.response?.data?.message ?? 'Erro ao carregar livros.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarLivros();
  }, []);

  async function handleEditar(id: number) {
    try {
      const livro = await getLivroById(id);
      setLivroSelecionado(livro);
      setMostrarFormCadastro(false);
    } catch (err: any) {
      alert(err.response?.data?.message ?? 'Erro ao carregar livro.');
    }
  }

  function handleNovo() {
    setLivroSelecionado(null);
    setMostrarFormCadastro(true);
  }

  function handleCancelar() {
    setLivroSelecionado(null);
    setMostrarFormCadastro(false);
  }

  return (
    <main>
      <section>
        <header>
          <h2>Gestão de Livros</h2>
          {isAdmin && (
            <button type="button" onClick={handleNovo}>
              + Novo Livro
            </button>
          )}
        </header>

        <LivroList
          livros={livros}
          loading={loading}
          isAdmin={isAdmin}
          onEditar={handleEditar}
          onAtualizar={carregarLivros}
        />
      </section>

      {(mostrarFormCadastro || livroSelecionado) && (
        <section>
          <LivroForm
            livro={livroSelecionado}
            isAdmin={isAdmin}
            onSalvo={() => {
              carregarLivros();
              setLivroSelecionado(null);
              setMostrarFormCadastro(false);
            }}
            onCancelar={handleCancelar}
          />
        </section>
      )}
    </main>
  );
}