import { useEffect, useState } from 'react';
import { UsuarioList } from './UsuarioList';
import { UsuarioForm } from './UsuarioForm';
import { getUsuarios, getUsuarioById, getUserId, getUserRole } from '../../api/usuario';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
}

export function UsuariosPage() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [usuarioSelecionado, setUsuarioSelecionado] =
    useState<Usuario | null>(null);
    const role = getUserRole();

    const isAdmin = role === 'Admin';
    async function carregarUsuarios() {
        const data = await getUsuarios();
        setUsuarios(data);
    }

    useEffect(() => {

        if (isAdmin) {
            carregarUsuarios();
        }

        async function carregarMeuPerfil() {

            const id = getUserId();

            if (!id) return;

            const usuario = await getUsuarioById(Number(id));

            setUsuarioSelecionado(usuario);
        }

        carregarMeuPerfil();

    }, []);

    return (
        <div className="page">

            <h1 className="page-title">
                Gestão de Usuários
            </h1>

            <div className="usuarios-container">

                {isAdmin ? (
                    <UsuarioList
                        usuarios={usuarios}
                        onEditar={setUsuarioSelecionado}
                        onAtualizar={carregarUsuarios}
                    />
                ) : (
                    <div className="card">
                        <h2>Meu Perfil</h2>
                        <p>
                            Você não possui acesso à tabela de usuários.
                        </p>
                    </div>
                )}

                <UsuarioForm
                    usuario={usuarioSelecionado}
                    onSalvo={async () => {

                        if (isAdmin) {
                            await carregarUsuarios();
                        }
                        else {
                            const id = getUserId();

                            if (id) {
                                const usuario = await getUsuarioById(Number(id));
                                setUsuarioSelecionado(usuario);
                            }
                        }
                    }}
                />

            </div>

        </div>
    );
}