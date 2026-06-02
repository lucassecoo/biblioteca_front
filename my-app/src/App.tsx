import { Navigate, Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { UsuariosPage } from './pages/usuarios/UsuariosPage'; 
import { EmprestimosPage } from './pages/Emprestimo/EmprestimosPage';
import { LivrosPage } from './pages/Livros/LivrosPage';
import { RequireAuth } from './routes/RequireAuth';
import { Layout } from './ui/Layout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="home" />} />
        <Route path="home" element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        
        <Route
          path="usuarios"
          element={<RequireAuth><UsuariosPage /></RequireAuth>}
        />

        <Route
          path="livros"
          element={<RequireAuth><LivrosPage /></RequireAuth>}
        />

        <Route
          path="emprestimos"
          element={<RequireAuth><EmprestimosPage /></RequireAuth>}
         />
      </Route>
    </Routes>
  );
}

export default App;