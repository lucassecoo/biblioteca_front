import React, { useState } from 'react';
import { registrarEmprestimo } from '../../api/emprestimo';

interface Props {
  onSalvo: () => void;
  onCancelar: () => void;
}

export function EmprestimoForm({
  onSalvo,
  onCancelar,
}: Props) {
  const [usuarioId, setUsuarioId] = useState('');
  const [livroId, setLivroId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!usuarioId || !livroId) {
      alert('Preencha todos os campos.');
      return;
    }

    setSubmitting(true);

    try {
      await registrarEmprestimo({
        usuarioId: Number(usuarioId),
        livroId: Number(livroId),
      });

      alert('Empréstimo registrado com sucesso!');
      onSalvo();
    } catch (err) {
        const error = err as any;
      
        alert(
          error.response?.data?.mensagem ??
          error.response?.data ??
          'Erro ao registrar empréstimo.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Registrar Empréstimo</h3>

      <div className="form-group">
        <label>Id do Usuário</label>

        <input
          type="number"
          value={usuarioId}
          onChange={(e) =>
            setUsuarioId(e.target.value)
          }
        />
      </div>

      <div className="form-group">
        <label>Id do Livro</label>

        <input
          type="number"
          value={livroId}
          onChange={(e) =>
            setLivroId(e.target.value)
          }
        />
      </div>

      <button
        className="btn-primary"
        disabled={submitting}
      >
        {submitting
          ? 'Salvando...'
          : 'Registrar'}
      </button>

      <button
        type="button"
        className="btn-secondary"
        onClick={onCancelar}
      >
        Cancelar
      </button>
    </form>
  );
}