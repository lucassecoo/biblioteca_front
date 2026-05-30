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
  const isAdmin = true;//const isAdmin = role === 'Admin';

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
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="page-title">Gestão de Livros</h1>
        {isAdmin && (
          <button className="btn-primary" onClick={handleNovo}>
            + Novo Livro
          </button>
        )}
      </div>

      {(mostrarFormCadastro || livroSelecionado) && (
        <div className="card">
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
        </div>
      )}

      {/* ✅ ESSA PARTE ESTAVA FALTANDO */}
      <div className="card">
        <LivroList
          livros={livros}
          loading={loading}
          isAdmin={isAdmin}
          onEditar={handleEditar}
          onAtualizar={carregarLivros}
        />
      </div>
    </div>
  );
}