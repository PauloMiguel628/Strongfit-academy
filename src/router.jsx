import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from './App';

const Home = lazy(() => import('./pages/Home'));
const Planos = lazy(() => import('./pages/Planos'));
const Matricula = lazy(() => import('./pages/Matricula'));
const Aluno = lazy(() => import('./pages/Aluno'));

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
    ]
  }
]);