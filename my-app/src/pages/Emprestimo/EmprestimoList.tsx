import React, { useMemo, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';

import {
  Emprestimo,
  devolverEmprestimo,
  deleteEmprestimo,
  getEmprestimoById,
} from '../../api/emprestimo';

interface Props {
  emprestimos: Emprestimo[];
  loading: boolean;
  isAdmin: boolean;
  onAtualizar: () => void;
}

export function EmprestimoList({
  emprestimos,
  loading,
  isAdmin,
  onAtualizar,
}: Props) {
  const [filtro, setFiltro] = useState('');

  async function handleDevolver(
    usuarioId: number,
    emprestimoId: number
  ) {
    try {
      await devolverEmprestimo(
        usuarioId,
        emprestimoId
      );

      alert('Devolução realizada com sucesso!');
      onAtualizar();
    } catch (err: any) {
      alert(
        err.response?.data?.mensagem ??
        'Erro ao devolver livro.'
      );
    }
  }

  async function handleDelete(id: number) {
    if (
      !window.confirm(
        'Deseja realmente excluir este empréstimo?'
      )
    )
      return;

    try {
      await deleteEmprestimo(id);
      onAtualizar();
    } catch (err: any) {
      alert(
        err.response?.data?.mensagem ??
        'Erro ao excluir empréstimo.'
      );
    }
  }

  async function handleDetalhes(
    id: number
  ) {
    try {
      const emprestimo =
        await getEmprestimoById(id);
  
      alert(
        `ID: ${emprestimo.id}
  
  Usuário: ${emprestimo.nomeUsuario}
  
  Livro: ${emprestimo.tituloLivro}
  
  Status: ${emprestimo.status}
  
  Data Empréstimo:
  ${new Date(
    emprestimo.dataEmprestimo
  ).toLocaleString()}
  
  Data Prevista:
  ${new Date(
    emprestimo.dataDevolucaoPrevista
  ).toLocaleString()}`
      );
    } catch (err: any) {
      alert(
        err.response?.data?.mensagem ??
        'Erro ao buscar empréstimo.'
      );
    }
  }

  const emprestimosFiltrados = useMemo(() => {
    const termo = filtro.toLowerCase();

    return emprestimos.filter(
      (e) =>
        e.nomeUsuario
          .toLowerCase()
          .includes(termo) ||
        e.tituloLivro
          .toLowerCase()
          .includes(termo)
    );
  }, [emprestimos, filtro]);

  const columns: TableColumn<Emprestimo>[] = [
    {
      name: 'ID',
      selector: (row) => row.id,
      sortable: true,
      width: '70px',
    },
    {
      name: 'Usuário',
      selector: (row) => row.nomeUsuario,
      sortable: true,
    },
    {
      name: 'Livro',
      selector: (row) => row.tituloLivro,
      sortable: true,
    },
    {
      name: 'Status',
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <span
          style={{
            color:
              row.status === 'Emprestado'
                ? '#dc2626'
                : '#16a34a',
            fontWeight: 600,
          }}
        >
          {row.status}
        </span>
      ),
    },
    {
      name: 'Data Empréstimo',
      selector: (row) =>
        new Date(
          row.dataEmprestimo
        ).toLocaleDateString(),
    },
    {
      name: 'Ações',
      width: '250px',
      cell: (row) => (
        
        <div
          style={{
            display: 'flex',
            gap: 6,
          }}
        >
          {row.status ===
            'Emprestado' && (
            <button
              className="btn-outline"
              style={{ whiteSpace: 'nowrap' }}
              onClick={() =>
                handleDevolver(
                  row.usuarioId,
                  row.id
                )
              }
            >
              Devolver
            </button>
          )}

        <button
        className="btn-outline"
        style={{ whiteSpace: 'nowrap' }}
        onClick={() =>
        handleDetalhes(row.id)
        }
        >
        Detalhes
        </button>

          {isAdmin && (
            <button
              className="btn-danger"
              style={{ whiteSpace: 'nowrap' }}
              onClick={() =>
                handleDelete(row.id)
              }
            >
              Excluir
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div
        className="form-group"
        style={{ marginBottom: 12 }}
      >
        <input
          type="text"
          placeholder="Pesquisar..."
          value={filtro}
          onChange={(e) =>
            setFiltro(e.target.value)
          }
        />
      </div>

      <DataTable
        columns={columns}
        data={emprestimosFiltrados}
        progressPending={loading}
        pagination
        highlightOnHover
        striped
        responsive
      />
    </div>
  );
}