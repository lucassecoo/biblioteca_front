import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { UsuariosPage } from './pages/usuarios/UsuariosPage';
import { LivrosPage } from './pages/livros/LivrosPage';
import { RequireAuth } from './routes/RequireAuth';
import { Layout } from './ui/Layout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route
          path="usuarios"
          element={<RequireAuth><UsuariosPage /></RequireAuth>}
        />
        <Route
          path="livros"
          element={<RequireAuth><LivrosPage /></RequireAuth>}
        />  {/* ← NOVO */}
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
}

export default App;