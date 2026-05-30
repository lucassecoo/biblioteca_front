import React, { useState, useMemo } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { deleteLivro, Livro } from '../../api/livro';

interface Props {
  livros: Livro[];
  loading: boolean;
  isAdmin: boolean;
  onEditar: (id: number) => void;
  onAtualizar: () => void;
}

export function LivroList({ livros, loading, isAdmin, onEditar, onAtualizar }: Props) {
  const [filtro, setFiltro] = useState('');

  async function handleDelete(id: number) {
    if (!window.confirm('Deseja realmente excluir este livro?')) return;
    try {
      await deleteLivro(id);
      onAtualizar();
    } catch (err: any) {
      alert(err.response?.data?.message ?? 'Erro ao excluir livro.');
    }
  }

  const livrosFiltrados = useMemo(() => {
    const termo = filtro.toLowerCase();
    return livros.filter(
      (l) =>
        l.titulo.toLowerCase().includes(termo) ||
        l.autor.toLowerCase().includes(termo) ||
        String(l.anoPublicacao).includes(termo)
    );
  }, [livros, filtro]);

  const columns: TableColumn<Livro>[] = [
    {
      name: 'ID',
      selector: (row) => row.id,
      sortable: true,
      width: '70px',
    },
    {
      name: 'Título',
      selector: (row) => row.titulo,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Autor',
      selector: (row) => row.autor,
      sortable: true,
    },
    {
      name: 'Ano de Publicação',
      selector: (row) => row.anoPublicacao,
      sortable: true,
      width: '160px',
    },
    {
      name: 'Qtd. Disponível',
      selector: (row) => row.quantidadeDisponivel,
      sortable: true,
      width: '140px',
      cell: (row) => (
        <span style={{ color: row.quantidadeDisponivel === 0 ? 'red' : 'green', fontWeight: 'bold' }}>
          {row.quantidadeDisponivel}
        </span>
      ),
    },
    ...(isAdmin
      ? [
          {
            name: 'Ações',
            width: '180px',
            cell: (row: Livro) => (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => onEditar(row.id)}
                  aria-label={`Editar livro ${row.titulo}`}
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(row.id)}
                  aria-label={`Excluir livro ${row.titulo}`}
                >
                  Excluir
                </button>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <article>
      <label htmlFor="filtro-livros">Pesquisar:</label>
      <input
        id="filtro-livros"
        type="search"
        placeholder="Filtrar por título, autor ou ano..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        aria-label="Filtrar livros"
      />

      <DataTable
        title="Livros"
        columns={columns}
        data={livrosFiltrados}
        progressPending={loading}
        progressComponent={<p>Carregando livros...</p>}
        pagination
        paginationPerPage={10}
        paginationRowsPerPageOptions={[5, 10, 20, 50]}
        noDataComponent={<p>Nenhum livro encontrado.</p>}
        highlightOnHover
        striped
        responsive
        defaultSortFieldId={1}
        paginationComponentOptions={{
          rowsPerPageText: 'Linhas por página:',
          rangeSeparatorText: 'de',
          noRowsPerPage: false,
          selectAllRowsItem: false,
        }}
      />
    </article>
  );
}