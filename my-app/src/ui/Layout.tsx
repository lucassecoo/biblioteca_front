import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { isAuthenticated, logout } from '../api/auth';

export function Layout() {
  const navigate = useNavigate();
  const auth = isAuthenticated();
  const nome = localStorage.getItem('nome');

  return (
    <>
      <header>
        <nav aria-label="Navegação principal">
          <Link to="/">Projeto Biblioteca</Link>
          <ul>
            <li><Link to="/">Home</Link></li>
            {!auth && <li><Link to="/login">Login</Link></li>}
            {!auth && <li><Link to="/register">Cadastro</Link></li>}
            {auth && <li><Link to="/usuarios">Gestão de Usuários</Link></li>}
            {auth && <li><Link to="/livros">Livros</Link></li>}  {/* ← NOVO */}
          </ul>
          {auth && (
            <span>Olá, {nome ?? 'usuário'}</span>
          )}
          {auth && (
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              Sair
            </button>
          )}
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}