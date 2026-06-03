import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from './App';

const Home = lazy(() => import('./pages/Home'));
const Planos = lazy(() => import('./pages/Planos'));
const Matricula = lazy(() => import('./pages/Matricula'));
const Aluno = lazy(() => import('./pages/Aluno'));
// Importando as novas páginas
const Aulas = lazy(() => import('./pages/Aulas'));
const AulaDetalhe = lazy(() => import('./pages/AulaDetalhe'));

// NOVAS IMPORTAÇÕES
const Unidades = lazy(() => import('./pages/Unidades'));
const UnidadeDetalhe = lazy(() => import('./pages/UnidadeDetalhe'));

const Login = lazy(() => import('./pages/Login'));


const Loading = () => <div className="p-10 text-center text-sfTeal font-bold">Carregando...</div>;

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Suspense fallback={<Loading />}><Home /></Suspense> },
      { path: '/planos', element: <Suspense fallback={<Loading />}><Planos /></Suspense> },
      { path: '/matricula', element: <Suspense fallback={<Loading />}><Matricula /></Suspense> },
      { path: '/aluno', element: <Suspense fallback={<Loading />}><Aluno /></Suspense> },
      // Novas rotas de aulas
      { path: '/aulas', element: <Suspense fallback={<Loading />}><Aulas /></Suspense> },
      { path: '/aulas/:id', element: <Suspense fallback={<Loading />}><AulaDetalhe /></Suspense> },
    
    // NOVAS ROTAS
      { path: '/unidades', element: <Suspense fallback={<Loading />}><Unidades /></Suspense> },
      { path: '/unidades/:id', element: <Suspense fallback={<Loading />}><UnidadeDetalhe /></Suspense> },
      { path: '/login', element: <Suspense fallback={<Loading />}><Login /></Suspense> },
    
    
    ]
  }
]);