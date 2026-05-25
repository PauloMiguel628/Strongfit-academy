import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Moon, Sun } from 'lucide-react';

export default function Navbar() {
  const { darkMode, toggleDarkMode, aluno, logout } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-sfNavy text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-3xl font-black italic tracking-tighter text-white">
              STRONGFIT
            </span>
          </Link>

          {/* Links Centrais (Escondido no mobile para focar na conversão) */}
          <div className="hidden md:flex space-x-8 items-center font-bold text-sm uppercase tracking-wide">
            <Link to="/" className="hover:text-sfGreen transition">A Academia</Link>
            <Link to="/planos" className="hover:text-sfGreen transition">Planos</Link>
          </div>

          {/* Botões da Direita */}
          <div className="flex items-center gap-3">
            {aluno ? (
              <>
                <Link to="/aluno" className="hidden sm:block border border-sfCream text-sfCream hover:bg-sfCream hover:text-sfNavy px-4 py-2 rounded-full text-sm font-bold transition">
                  Área do Aluno ↗
                </Link>
                <button onClick={handleLogout} className="text-sm font-bold hover:text-red-400">Sair</button>
              </>
            ) : (
              <>
                <Link to="/matricula" className="hidden sm:block border border-sfCream text-sfCream hover:bg-sfCream hover:text-sfNavy px-4 py-2 rounded-full text-sm font-bold transition">
                  Área do Aluno ↗
                </Link>
                <Link to="/matricula" className="bg-sfCream text-sfNavy px-6 py-2 rounded-full text-sm font-black uppercase hover:bg-sfGreen transition flex items-center gap-1">
                  Matricule-se ↗
                </Link>
              </>
            )}
            
            {/* Dark Mode Toggle */}
            <button onClick={toggleDarkMode} className="p-2 ml-2 rounded-full hover:bg-sfTeal transition text-sfCream">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}