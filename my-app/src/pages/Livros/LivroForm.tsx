import React, { useEffect, useState } from 'react';
import { cadastrarLivro, updateLivro, Livro } from '../../api/livro'; // ✅ corrigido

interface Props {
  livro: Livro | null;
  isAdmin: boolean;
  onSalvo: () => void;
  onCancelar: () => void;
}

interface FormErrors {
  titulo?: string;
  autor?: string;
  anoPublicacao?: string;
  quantidadeDisponivel?: string;
}

const ANO_MIN = 1000;
const ANO_MAX = new Date().getFullYear();

export function LivroForm({ livro, isAdmin, onSalvo, onCancelar }: Props) {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [anoPublicacao, setAnoPublicacao] = useState('');
  const [quantidadeDisponivel, setQuantidadeDisponivel] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const isEdicao = livro !== null;

  useEffect(() => {
    if (livro) {
      setTitulo(livro.titulo);
      setAutor(livro.autor);
      setAnoPublicacao(String(livro.anoPublicacao));
      setQuantidadeDisponivel(String(livro.quantidadeDisponivel));
    } else {
      setTitulo('');
      setAutor('');
      setAnoPublicacao('');
      setQuantidadeDisponivel('');
    }
    setErrors({});
  }, [livro]);

  function validate(): boolean {
    const newErrors: FormErrors = {};

    if (!titulo.trim()) {
      newErrors.titulo = 'O título é obrigatório.';
    } else if (titulo.trim().length < 2) {
      newErrors.titulo = 'O título deve ter pelo menos 2 caracteres.';
    } else if (titulo.trim().length > 150) {
      newErrors.titulo = 'O título deve ter no máximo 150 caracteres.';
    }

    if (!autor.trim()) {
      newErrors.autor = 'O autor é obrigatório.';
    } else if (autor.trim().length < 2) {
      newErrors.autor = 'O nome do autor deve ter pelo menos 2 caracteres.';
    } else if (autor.trim().length > 120) {
      newErrors.autor = 'O nome do autor deve ter no máximo 120 caracteres.';
    }

    const ano = Number(anoPublicacao);
    if (!anoPublicacao) {
      newErrors.anoPublicacao = 'O ano de publicação é obrigatório.';
    } else if (!Number.isInteger(ano) || ano < ANO_MIN || ano > ANO_MAX) {
      newErrors.anoPublicacao = `O ano deve ser um número inteiro entre ${ANO_MIN} e ${ANO_MAX}.`;
    }

    if (!isEdicao) {
      const qtd = Number(quantidadeDisponivel);
      if (quantidadeDisponivel === '') {
        newErrors.quantidadeDisponivel = 'A quantidade é obrigatória.';
      } else if (!Number.isInteger(qtd) || qtd < 0) {
        newErrors.quantidadeDisponivel = 'A quantidade deve ser um número inteiro não negativo.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate() || !isAdmin) return;
    setSubmitting(true);
    try {
      if (isEdicao && livro) {
        await updateLivro(livro.id, {
          Titulo: titulo.trim(),
          Autor: autor.trim(),
          AnoPublicacao: Number(anoPublicacao),
          QuantidadeDisponivel: Number(quantidadeDisponivel),
        });
        alert('Livro atualizado com sucesso!');
      } else {
        await cadastrarLivro({
          Titulo: titulo.trim(),
          Autor: autor.trim(),
          AnoPublicacao: Number(anoPublicacao),
          QuantidadeDisponivel: Number(quantidadeDisponivel),
        });
        alert('Livro cadastrado com sucesso!');
      }
      onSalvo();
    } catch (err: any) {
      const msg =
        err.response?.data?.message ??
        err.response?.data ??
        'Erro ao salvar livro. Tente novamente.';
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h3 className="page-title">{isEdicao ? 'Editar Livro' : 'Cadastrar Novo Livro'}</h3>

      <div className="form-group">
        <label>Título *</label>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          maxLength={150}
          placeholder="Ex: Dom Casmurro"
        />
        {errors.titulo && <span className="form-error">{errors.titulo}</span>}
      </div>

      <div className="form-group">
        <label>Autor *</label>
        <input
          type="text"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
          maxLength={120}
          placeholder="Ex: Machado de Assis"
        />
        {errors.autor && <span className="form-error">{errors.autor}</span>}
      </div>

      <div className="form-group">
        <label>Ano de Publicação *</label>
        <input
          type="number"
          value={anoPublicacao}
          onChange={(e) => setAnoPublicacao(e.target.value)}
          min={ANO_MIN}
          max={ANO_MAX}
          placeholder={`Ex: ${ANO_MAX}`}
        />
        {errors.anoPublicacao && <span className="form-error">{errors.anoPublicacao}</span>}
      </div>

      {!isEdicao && (
        <div className="form-group">
          <label>Quantidade Disponível *</label>
          <input
            id="quantidadeDisponivel"
            name="quantidadeDisponivel"
            type="number"
            value={quantidadeDisponivel}
            onChange={(e) => setQuantidadeDisponivel(e.target.value)}
            min={0}
            placeholder="Ex: 5"
          />
          {errors.quantidadeDisponivel && <span className="form-error">{errors.quantidadeDisponivel}</span>}
        </div>
      )}

      <div className="form-actions">
        <button className="btn-primary" type="submit" disabled={submitting}>
          {submitting ? 'Salvando...' : isEdicao ? 'Atualizar' : 'Cadastrar'}
        </button>
        <button className="btn-secondary" type="button" onClick={onCancelar}>
          Cancelar
        </button>
      </div>
    </form>
  );
}