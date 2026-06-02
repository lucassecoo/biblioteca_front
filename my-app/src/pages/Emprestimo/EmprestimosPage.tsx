import React, { useEffect, useState } from 'react';

import {
  Emprestimo,
  getEmprestimos,
} from '../../api/emprestimo';

import { getUserRole } from '../../api/usuario';

import { EmprestimoForm } from './EmprestimoForm';
import { EmprestimoList } from './EmprestimoList';

export function EmprestimosPage() {
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([]);
  const [mostrarFormCadastro, setMostrarFormCadastro] = useState(false);
  const [loading, setLoading] = useState(false);

  const role = getUserRole();
  const isAdmin = role === 'Admin';

  async function carregarEmprestimos() {
    setLoading(true);

    try {
      const data = await getEmprestimos();
      setEmprestimos(data);
    } catch (err: any) {
      alert(
        err.response?.data?.message ??
        'Erro ao carregar empréstimos.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarEmprestimos();
  }, []);

  function handleNovo() {
    setMostrarFormCadastro(true);
  }

  function handleCancelar() {
    setMostrarFormCadastro(false);
  }

  return (
    <div className="page">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1 className="page-title">
          Gestão de Empréstimos
        </h1>

        <button
          className="btn-primary"
          onClick={handleNovo}
        >
          + Novo Empréstimo
        </button>
      </div>

      {mostrarFormCadastro && (
        <div className="card">
          <EmprestimoForm
            onSalvo={() => {
              carregarEmprestimos();
              setMostrarFormCadastro(false);
            }}
            onCancelar={handleCancelar}
          />
        </div>
      )}

      <div className="card">
        <EmprestimoList
          emprestimos={emprestimos}
          loading={loading}
          isAdmin={isAdmin}
          onAtualizar={carregarEmprestimos}
        />
      </div>
    </div>
  );
}