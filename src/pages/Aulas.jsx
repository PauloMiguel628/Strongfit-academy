import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { LISTA_AULAS } from '../data/aulas';
import { useDynatrace } from '../hooks/useDynatrace';

export default function Aulas() {
  const { sendAction } = useDynatrace();
  const [termoBusca, setTermoBusca] = useState('');

  useEffect(() => {
    sendAction('aulas_acesso');
  }, [sendAction]);

  const aulasFiltradas = LISTA_AULAS.filter(aula => 
    aula.nome.toLowerCase().includes(termoBusca.toLowerCase())
  );

  return (
    <div className="-m-4 md:-m-8">
      
      {/* Header Escuro (Estilo Bluefit) */}
      <section className="bg-sfBlack text-white py-16 px-4 md:px-12 border-b-4 border-sfTeal">
        <div className="max-w-7xl mx-auto">
          <p className="text-sfTeal font-bold text-xl md:text-2xl mb-2">Conheça</p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter">nossas aulas</h1>
        </div>
      </section>

      {/* Área Principal de Filtro e Lista */}
      <section className="bg-white dark:bg-sfNavy py-12 px-4 md:px-12 min-h-screen">
        <div className="max-w-7xl mx-auto">
          
          {/* Cabeçalho da Lista e Busca */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
            <div>
              <p className="text-gray-500 dark:text-gray-300 text-lg">Aulas</p>
              <h2 className="text-4xl font-black text-sfNavy dark:text-sfCream">StrongFit</h2>
            </div>
            
            <div className="relative w-full md:w-auto">
              <input 
                type="text" 
                placeholder="Buscar aula..." 
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                className="w-full md:w-80 border-b-2 border-sfNavy dark:border-sfCream bg-transparent py-2 pl-2 pr-10 outline-none focus:border-sfTeal transition text-sfNavy dark:text-sfCream placeholder-gray-400 font-medium"
              />
              <Search className="absolute right-2 top-2 text-sfNavy dark:text-sfCream" size={20} />
            </div>
          </div>

          <p className="text-gray-700 dark:text-gray-300 mb-12 max-w-4xl leading-relaxed">
            Nossas aulas transcendem o simples exercício, são experiências transformadoras. Oferecemos variedade para todos os gostos e níveis. Guiadas por instrutores apaixonados, cada aula é uma jornada que equilibra desafio e diversão.
          </p>

          {/* Grid de Aulas - Corrigido para altura fixa e uniforme */}
          {aulasFiltradas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {aulasFiltradas.map((aula) => (
                <Link 
                  key={aula.id} 
                  to={`/aulas/${aula.id}`}
                  className="flex flex-col sm:flex-row bg-white dark:bg-sfBlack border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group sm:h-72"
                >
                  {/* Imagem do Card */}
                  <div className="w-full sm:w-2/5 h-48 sm:h-full flex-shrink-0">
                    <img 
                      src={aula.imagem} 
                      alt={aula.nome} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  {/* Conteúdo do Card */}
                  <div className="w-full sm:w-3/5 p-6 flex flex-col justify-between flex-grow">
                    <div>
                      {/* line-clamp-1 garante que o título tenha só 1 linha */}
                      <h3 className="text-xl md:text-2xl font-black text-sfNavy dark:text-sfCream tracking-tight mb-3 line-clamp-1">
                        {aula.nome}
                      </h3>
                      {/* line-clamp-3 garante que a descrição tenha no máximo 3 linhas */}
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                        {aula.descricao}
                      </p>
                    </div>
                    <span className="text-sfTeal dark:text-sfGreen font-bold text-sm mt-4 inline-flex items-center gap-1 group-hover:text-sfNavy dark:group-hover:text-white transition">
                      Saiba mais sobre essa aula ↗
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-2xl font-bold text-gray-500">Nenhuma aula encontrada com "{termoBusca}".</p>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}