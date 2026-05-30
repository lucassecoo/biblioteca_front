import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { isAuthenticated, logout } from '../api/auth';

export function Layout() {
  const navigate = useNavigate();
  const auth = isAuthenticated();
  const nome = localStorage.getItem('nome');

  return (
    <>
      <header className="app-header">
        <span className="app-brand">📚 Projeto Biblioteca</span>
        <nav className="app-nav">
          <Link to="/home">Home</Link>
          {!auth && <Link to="/login">Login</Link>}
          {!auth && <Link to="/register">Cadastro</Link>}
          {auth && <Link to="/usuarios">Gestão de Usuários</Link>}
          {auth && <Link to="/livros">Livros</Link>}
        </nav>
        <div className="app-user">
          {auth && <span>Olá, {nome ?? 'usuário'}</span>}
          {auth && (
            <button
              className="btn-danger"
              onClick={() => { logout(); navigate('/login', { replace: true }); }}
            >
              Sair
            </button>
          )}
        </div>
      </header>
      <div className="app-container">
        <Outlet />
      </div>
    </>
  );
}