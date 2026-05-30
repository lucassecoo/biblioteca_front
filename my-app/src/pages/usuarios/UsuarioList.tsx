import { deleteUsuario } from '../../api/usuario';
import { getUsuarioById } from '../../api/usuario';
interface Props {
  usuarios: any[];
  onEditar: (usuario: any) => void;
  onAtualizar: () => void;
}

export function UsuarioList({
  usuarios,
  onEditar,
  onAtualizar
}: Props) {

    async function handleDelete(id: number) {

        if (!window.confirm('Deseja excluir?'))
            return;

        try {
            await deleteUsuario(id);
        }
        catch (err: any) {
            alert(
                err.response?.data?.message ??
                'Erro ao excluir usuário'
            );
        }

        onAtualizar();
    }

    async function handleEditar(id: number) {
        try {
            const usuario = await getUsuarioById(id);

            onEditar(usuario);
        }
        catch (err: any) {
            alert(
            err.response?.data ??
            'Erro ao carregar usuário'
            );
        }
    }

  return (
    <div className="card">

      <h2>Usuários</h2>

      <table className="usuario-table">

        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.nome}</td>
              <td>{usuario.email}</td>

              <td>
                <div className="usuario-actions">

                  <button
                    className="btn-outline"
                    onClick={() => handleEditar(usuario.id)}
                  >
                    Editar
                  </button>

                  <button
                    className="btn-danger"
                    onClick={() => handleDelete(usuario.id)}
                  >
                    Excluir Usuário
                  </button>

                </div>
              </td>

            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}