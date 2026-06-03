import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Trocamos o ícone 'Instagram' por 'Camera' para garantir compatibilidade com a sua versão
import { MapPin, Clock, Copy, MapPinned, Navigation, Camera } from 'lucide-react';
import { LISTA_UNIDADES } from '../data/unidades';
import { useDynatrace } from '../hooks/useDynatrace';
import toast from 'react-hot-toast';

export default function UnidadeDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { sendAction } = useDynatrace();
  
  const unidade = LISTA_UNIDADES.find(u => u.id === id);
  const [imagemAtiva, setImagemAtiva] = useState(unidade?.imagemPrincipal || '');

  useEffect(() => {
    if (unidade) {
      sendAction('unidade_detalhe_acesso', { unidadeNome: unidade.nome });
      setImagemAtiva(unidade.imagemPrincipal);
    }
  }, [unidade, sendAction]);

  if (!unidade) {
    return (
      <div className="text-center mt-32">
        <h2 className="text-3xl font-black text-sfNavy dark:text-white mb-4">Unidade não encontrada</h2>
        <button onClick={() => navigate('/unidades')} className="text-blue-600 font-bold hover:underline">
          Voltar para a lista de unidades
        </button>
      </div>
    );
  }

  const copiarEndereco = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(unidade.endereco);
      toast.success('Endereço copiado para a área de transferência!');
    } else {
      toast.error('Seu navegador não suporta a cópia automática.');
    }
  };

  const galeria = unidade.galeria || [];
  const imagensDisponiveis = [unidade.imagemPrincipal, ...galeria].filter(Boolean).slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      
      {/* Topo: Nome e CTA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6 border-b border-gray-200 dark:border-gray-800 pb-6">
        <div>
          <p className="text-blue-800 dark:text-blue-400 font-bold uppercase tracking-widest text-sm flex items-center gap-4">
            <span className="w-12 h-0.5 bg-blue-800 dark:bg-blue-400 block"></span>
            Unidade
          </p>
          <h1 className="text-5xl font-black text-sfNavy dark:text-white mt-1">{unidade.nome}</h1>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right">
            <span className="text-sm font-bold text-gray-500 uppercase">R$</span>
            <span className="text-4xl font-black text-blue-500"> 89,90</span>
            <p className="text-xs text-gray-500 uppercase font-bold text-right">no plano básico</p>
          </div>
          <button 
            onClick={() => navigate('/planos', { state: { unidadeId: unidade.id } })}
            className="bg-blue-900 text-white px-8 py-4 rounded-full font-bold uppercase tracking-wide hover:bg-blue-800 transition whitespace-nowrap shadow-lg"
          >
            Matricule-se já ↗
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Coluna Esquerda: Galeria */}
        <div className="lg:col-span-2">
          <div className="w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-4 shadow-sm border border-gray-100 dark:border-gray-800">
            <img src={imagemAtiva} alt={unidade.nome} className="w-full h-full object-cover transition-opacity duration-300" />
          </div>
          
          {/* Thumbnails */}
          <div className="flex gap-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
            {imagensDisponiveis.map((img, idx) => (
              <button 
                key={idx} 
                onClick={() => setImagemAtiva(img)}
                className={`w-24 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition ${
                  imagemAtiva === img ? 'border-blue-500 opacity-100 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} className="w-full h-full object-cover" alt={`Foto ${idx + 1}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Coluna Direita: Informações */}
        <div className="space-y-6">
          
          {/* Card Endereço */}
          <div className="bg-white dark:bg-sfNavy border border-gray-100 dark:border-gray-800 p-6 rounded-2xl shadow-sm">
            <h3 className="flex items-center gap-2 text-xl font-bold text-sfNavy dark:text-white mb-4">
              <MapPin className="text-blue-800 dark:text-blue-400" /> Endereço
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 leading-relaxed">
              {unidade.endereco}
            </p>
            <div className="flex gap-2 text-xs font-bold">
              <button onClick={copiarEndereco} className="flex-1 flex items-center justify-center gap-1 py-2 border border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition text-gray-500 dark:text-gray-400">
                <Copy size={14} /> Copiar
              </button>
              <button className="flex-1 flex items-center justify-center gap-1 py-2 border border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition text-gray-500 dark:text-gray-400">
                <MapPinned size={14} /> Maps
              </button>
              <button className="flex-1 flex items-center justify-center gap-1 py-2 border border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition text-gray-500 dark:text-gray-400">
                <Navigation size={14} /> Waze
              </button>
            </div>
          </div>

          {/* Card Horários */}
          <div className="bg-white dark:bg-sfNavy border border-gray-100 dark:border-gray-800 p-6 rounded-2xl shadow-sm">
            <h3 className="flex items-center gap-2 text-xl font-bold text-sfNavy dark:text-white mb-4">
              <Clock className="text-blue-800 dark:text-blue-400" /> Horários
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">
              {unidade.horarios}
            </p>
          </div>

          {/* Botão Instagram (usando o ícone Camera) */}
          <button className="w-full flex justify-center items-center gap-2 border-2 border-pink-600 text-pink-600 py-4 rounded-full font-bold uppercase text-sm hover:bg-pink-50 dark:hover:bg-pink-900/20 transition shadow-sm">
            Ver no Instagram <Camera size={18} />
          </button>
          
        </div>
      </div>
    </div>
  );
}