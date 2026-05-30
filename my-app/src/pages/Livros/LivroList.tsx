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
    { name: 'ID', selector: (row) => row.id, sortable: true, width: '70px' },
    { name: 'Título', selector: (row) => row.titulo, sortable: true, wrap: true },
    { name: 'Autor', selector: (row) => row.autor, sortable: true },
    { name: 'Ano', selector: (row) => row.anoPublicacao, sortable: true, width: '90px' },
    {
      name: 'Qtd. Disponível',
      selector: (row) => row.quantidadeDisponivel,
      sortable: true,
      width: '140px',
      cell: (row) => (
        <span style={{ color: row.quantidadeDisponivel === 0 ? '#dc2626' : '#16a34a', fontWeight: 600 }}>
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
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="btn-outline" onClick={() => onEditar(row.id)}>Editar</button>
              <button className="btn-danger" onClick={() => handleDelete(row.id)}>Excluir</button>
            </div>
          ),
        },
      ]
      : []),
  ];

  return (
    <div>
      <div className="form-group" style={{ marginBottom: 12 }}>
        <input
          type="text"
          placeholder="Pesquisar por título, autor ou ano..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>
      <DataTable
        columns={columns}
        data={livrosFiltrados}
        progressPending={loading}
        progressComponent={<p className="loading">Carregando livros...</p>}
        pagination
        paginationPerPage={10}
        paginationRowsPerPageOptions={[5, 10, 20, 50]}
        noDataComponent={<p className="empty-state">Nenhum livro encontrado.</p>}
        highlightOnHover
        striped
        responsive
        defaultSortFieldId={1}
        paginationComponentOptions={{
          rowsPerPageText: 'Linhas por página:',
          rangeSeparatorText: 'de',
        }}
      />
    </div>
  );
}