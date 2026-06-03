import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin } from 'lucide-react';
import { LISTA_UNIDADES } from '../data/unidades';
import { useDynatrace } from '../hooks/useDynatrace';

export default function Unidades() {
  const { sendAction } = useDynatrace();
  const navigate = useNavigate();
  const [termoBusca, setTermoBusca] = useState('');

  useEffect(() => {
    sendAction('unidades_acesso');
  }, [sendAction]);

  const unidadesFiltradas = LISTA_UNIDADES.filter(unidade => 
    unidade.nome.toLowerCase().includes(termoBusca.toLowerCase()) || 
    unidade.endereco.toLowerCase().includes(termoBusca.toLowerCase())
  );

  return (
    <div className="-m-4 md:-m-8">
      {/* Cabeçalho */}
      <section className="bg-sfBlack text-white py-16 px-4 md:px-12 border-b-4 border-sfTeal">
        <div className="max-w-7xl mx-auto">
          <p className="text-sfTeal font-bold text-xl md:text-2xl mb-2">Encontre a sua</p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter">Unidade</h1>
        </div>
      </section>

      {/* Lista e Filtro */}
      <section className="bg-white dark:bg-sfNavy py-12 px-4 md:px-12 min-h-screen">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <p className="text-gray-500 dark:text-gray-300 text-lg">Unidades</p>
              <h2 className="text-4xl font-black text-sfNavy dark:text-sfCream">StrongFit</h2>
            </div>
            <div className="relative w-full md:w-80">
              <input 
                type="text" 
                placeholder="Buscar por bairro ou unidade..." 
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                className="w-full border-b-2 border-sfNavy dark:border-sfCream bg-transparent py-2 pl-2 pr-10 outline-none focus:border-sfTeal transition text-sfNavy dark:text-sfCream placeholder-gray-400 font-medium"
              />
              <Search className="absolute right-2 top-2 text-sfNavy dark:text-sfCream" size={20} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {unidadesFiltradas.map((unidade) => (
              <div key={unidade.id} className="bg-white dark:bg-sfBlack border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition flex flex-col">
                
                {/* Imagem com Badges */}
                <div className="relative h-48 w-full overflow-hidden">
                  <img src={unidade.imagemPrincipal} alt={unidade.nome} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  
                  {/* Badge Preço */}
                  <div className="absolute bottom-3 left-3 bg-blue-800 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                    A partir de R$ 89,90/mês
                  </div>
                  {/* Badge Distância */}
                  <div className="absolute bottom-3 right-3 bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                    <MapPin size={12} /> {unidade.distancia}
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-2xl font-black text-sfNavy dark:text-white mb-2">{unidade.nome}</h3>
                  <div className="flex items-start gap-2 mb-6 text-gray-500 dark:text-gray-400 text-sm">
                    <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                    <p>{unidade.endereco}</p>
                  </div>

                  <div className="mt-auto space-y-3">
                    <button 
                      onClick={() => navigate('/planos', { state: { unidadeId: unidade.id } })}
                      className="w-full bg-blue-900 text-white font-bold uppercase tracking-wide py-3 rounded-full hover:bg-blue-800 transition"
                    >
                      Matricule-se
                    </button>
                    <Link 
                      to={`/unidades/${unidade.id}`}
                      className="flex items-center justify-center gap-2 w-full border border-blue-900 text-blue-900 dark:border-blue-400 dark:text-blue-400 font-bold uppercase py-3 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
                    >
                      Ver mais ↗
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}