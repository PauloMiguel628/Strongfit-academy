import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Moon, Sun, Menu, X, Dumbbell } from 'lucide-react';

export default function Navbar() {
  const [menuAberto, setMenuAberto] = useState(false);
  const { darkMode, toggleDarkMode, aluno, logout } = useStore();
  const navigate = useNavigate();

  // Efeito fundamental para injetar a classe "dark" no HTML para o Tailwind funcionar
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuAberto(false);
  };

  return (
    <nav className="bg-sfNavy text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Original */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-3xl font-black italic tracking-tighter text-white">
              STRONGFIT
            </span>
          </Link>

          {/* Links Centrais (Desktop) */}
          <div className="hidden md:flex space-x-8 items-center font-bold text-sm uppercase tracking-wide">
            <Link to="/" className="hover:text-sfGreen transition">A Academia</Link>
            <Link to="/aulas" className="hover:text-sfGreen transition">Aulas</Link>
            <Link to="/unidades" className="hover:text-sfGreen transition">Unidades</Link>
            <Link to="/planos" className="hover:text-sfGreen transition">Planos</Link>
          </div>

          {/* Botões da Direita (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {aluno ? (
              <>
                <Link to="/aluno" className="border border-sfCream text-sfCream hover:bg-sfCream hover:text-sfNavy px-4 py-2 rounded-full text-sm font-bold transition">
                  Meu Dashboard ↗
                </Link>
                <button onClick={handleLogout} className="text-sm font-bold hover:text-red-400">Sair</button>
              </>
            ) : (
              <>
                <Link to="/login" className="border border-sfCream text-sfCream hover:bg-sfCream hover:text-sfNavy px-4 py-2 rounded-full text-sm font-bold transition">
                  Área do Aluno ↗
                </Link>
                <Link to="/unidades" className="bg-sfCream text-sfNavy px-6 py-2 rounded-full text-sm font-black uppercase hover:bg-sfGreen transition flex items-center gap-1">
                  Matricule-se ↗
                </Link>
              </>
            )}
            
            {/* Dark Mode Toggle - Botão que ativa e desativa */}
            <button onClick={toggleDarkMode} className="p-2 ml-2 rounded-full hover:bg-sfTeal transition text-sfCream">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          {/* Controles Mobile (Aparecem apenas em ecrãs pequenos) */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-sfTeal transition text-sfCream">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="text-white focus:outline-none" onClick={() => setMenuAberto(!menuAberto)}>
              {menuAberto ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

        </div>
      </div>

      {/* Menu Mobile (Abre ao clicar no Hambúrguer) */}
      {menuAberto && (
        <div className="md:hidden absolute top-full left-0 w-full bg-sfNavy border-t border-gray-800 shadow-xl py-6 flex flex-col items-center gap-5">
          <Link to="/" onClick={() => setMenuAberto(false)} className="font-bold uppercase tracking-wide hover:text-sfGreen">A Academia</Link>
          <Link to="/aulas" onClick={() => setMenuAberto(false)} className="font-bold uppercase tracking-wide hover:text-sfGreen">Aulas</Link>
          <Link to="/unidades" onClick={() => setMenuAberto(false)} className="font-bold uppercase tracking-wide hover:text-sfGreen">Unidades</Link>
          <Link to="/planos" onClick={() => setMenuAberto(false)} className="font-bold uppercase tracking-wide hover:text-sfGreen">Planos</Link>
          
          <div className="w-full h-px bg-gray-800 my-2"></div>
          
          {aluno ? (
            <div className="flex flex-col items-center gap-4 w-full px-6">
              <Link to="/aluno" onClick={() => setMenuAberto(false)} className="w-full text-center border border-sfCream text-sfCream py-3 rounded-full font-black uppercase hover:bg-sfCream hover:text-sfNavy transition">
                Meu Dashboard ↗
              </Link>
              <button onClick={handleLogout} className="w-full text-center text-red-400 font-bold uppercase py-2">
                Sair
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 w-full px-6">
              <Link to="/login" onClick={() => setMenuAberto(false)} className="w-full text-center border border-sfCream text-sfCream py-3 rounded-full font-black uppercase hover:bg-sfCream hover:text-sfNavy transition">
                Área do Aluno ↗
              </Link>
              <Link to="/unidades" onClick={() => setMenuAberto(false)} className="w-full text-center bg-sfCream text-sfNavy py-3 rounded-full font-black uppercase shadow-md hover:bg-sfGreen transition">
                Matricule-se ↗
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}