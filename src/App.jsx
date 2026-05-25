import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
        <Toaster position="bottom-right" />
      </div>
    </ErrorBoundary>
  );
}

export default App;