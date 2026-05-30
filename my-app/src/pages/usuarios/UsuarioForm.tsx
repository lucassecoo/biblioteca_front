import { useEffect, useState } from 'react';
import { updateUsuario } from '../../api/usuario';

interface Props {
  usuario: any;
  onSalvo: () => void;
}

export function UsuarioForm({
  usuario,
  onSalvo
}: Props) {

  const [Nome, setNome] = useState('');
  const [Email, setEmail] = useState('');

  useEffect(() => {

    if (usuario) {
      setNome(usuario.nome);
      setEmail(usuario.email);
    }

  }, [usuario]);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!usuario)
      return;

    try{
        await updateUsuario(usuario.id, {
        Nome,
        Email
        });
    }
    catch (error: any) {
      console.error(error.response?.data ?? error);
      alert('Falha ao atualizar usuário');
      return;
    }

    alert('Usuário atualizado');

    onSalvo();
  }

  return (
    <div className="card">

      <h2>Editar Usuário</h2>

      <form
          className="card usuario-form"
          onSubmit={handleSubmit}
      >

        <div className="form-group">
            <label>Nome</label>
            <input
                value={Nome}
                onChange={(e) => setNome(e.target.value)}
            />
        </div>

        <div className="form-group">
            <label>Email</label>
            <input
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
            />
        </div>

        <div className="form-actions">
            <button
                className="btn-primary"
                type="submit"
            >
                Salvar
            </button>
        </div>

      </form>

    </div>
  );
}