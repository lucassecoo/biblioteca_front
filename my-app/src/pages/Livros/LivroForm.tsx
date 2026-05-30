import React, { useEffect, useState } from 'react';
import { cadastrarLivro, updateLivro, Livro } from '../../api/livro';

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
    if (!validate()) return;
    if (!isAdmin) return;

    setSubmitting(true);
    try {
      if (isEdicao && livro) {
        await updateLivro(livro.id, {
          Titulo: titulo.trim(),
          Autor: autor.trim(),
          AnoPublicacao: Number(anoPublicacao),
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
    <article>
      <h3>{isEdicao ? 'Editar Livro' : 'Cadastrar Novo Livro'}</h3>

      <form onSubmit={handleSubmit} noValidate aria-label={isEdicao ? 'Formulário de edição de livro' : 'Formulário de cadastro de livro'}>
        <fieldset>
          <legend>{isEdicao ? 'Dados do Livro' : 'Novo Livro'}</legend>

          <div>
            <label htmlFor="livro-titulo">Título *</label>
            <input
              id="livro-titulo"
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              maxLength={150}
              required
              aria-required="true"
              aria-describedby={errors.titulo ? 'erro-titulo' : undefined}
              aria-invalid={!!errors.titulo}
              placeholder="Ex: Dom Casmurro"
            />
            {errors.titulo && (
              <span id="erro-titulo" role="alert" style={{ color: 'red' }}>
                {errors.titulo}
              </span>
            )}
          </div>

          <div>
            <label htmlFor="livro-autor">Autor *</label>
            <input
              id="livro-autor"
              type="text"
              value={autor}
              onChange={(e) => setAutor(e.target.value)}
              maxLength={120}
              required
              aria-required="true"
              aria-describedby={errors.autor ? 'erro-autor' : undefined}
              aria-invalid={!!errors.autor}
              placeholder="Ex: Machado de Assis"
            />
            {errors.autor && (
              <span id="erro-autor" role="alert" style={{ color: 'red' }}>
                {errors.autor}
              </span>
            )}
          </div>

          <div>
            <label htmlFor="livro-ano">Ano de Publicação *</label>
            <input
              id="livro-ano"
              type="number"
              value={anoPublicacao}
              onChange={(e) => setAnoPublicacao(e.target.value)}
              min={ANO_MIN}
              max={ANO_MAX}
              required
              aria-required="true"
              aria-describedby={errors.anoPublicacao ? 'erro-ano' : undefined}
              aria-invalid={!!errors.anoPublicacao}
              placeholder={`Ex: ${ANO_MAX}`}
            />
            {errors.anoPublicacao && (
              <span id="erro-ano" role="alert" style={{ color: 'red' }}>
                {errors.anoPublicacao}
              </span>
            )}
          </div>

          {!isEdicao && (
            <div>
              <label htmlFor="livro-quantidade">Quantidade Disponível *</label>
              <input
                id="livro-quantidade"
                type="number"
                value={quantidadeDisponivel}
                onChange={(e) => setQuantidadeDisponivel(e.target.value)}
                min={0}
                required
                aria-required="true"
                aria-describedby={errors.quantidadeDisponivel ? 'erro-qtd' : undefined}
                aria-invalid={!!errors.quantidadeDisponivel}
                placeholder="Ex: 5"
              />
              {errors.quantidadeDisponivel && (
                <span id="erro-qtd" role="alert" style={{ color: 'red' }}>
                  {errors.quantidadeDisponivel}
                </span>
              )}
            </div>
          )}
        </fieldset>

        <div>
          <button type="submit" disabled={submitting}>
            {submitting ? 'Salvando...' : isEdicao ? 'Atualizar' : 'Cadastrar'}
          </button>
          <button type="button" onClick={onCancelar} disabled={submitting}>
            Cancelar
          </button>
        </div>
      </form>
    </article>
  );
}