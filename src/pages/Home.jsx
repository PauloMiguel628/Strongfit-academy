import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDynatrace } from '../hooks/useDynatrace';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const IMAGENS_CARROSSEL = [
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1470&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1470&auto=format&fit=crop"
];

export default function Home() {
  const { sendAction } = useDynatrace();
  const [slideAtual, setSlideAtual] = useState(0);

  useEffect(() => {
    sendAction('home_acesso');
  }, [sendAction]);

  const prevSlide = () => {
    setSlideAtual(slideAtual === 0 ? IMAGENS_CARROSSEL.length - 1 : slideAtual - 1);
  };

  const nextSlide = () => {
    setSlideAtual(slideAtual === IMAGENS_CARROSSEL.length - 1 ? 0 : slideAtual + 1);
  };

  return (
    <div className="-m-4 md:-m-8"> {/* Compensa o padding do main para o Hero ocupar tudo */}
      
      {/* HERO SECTION */}
      <section className="relative h-[85vh] w-full flex items-center bg-sfBlack overflow-hidden">
        {/* Background Image com Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1470&auto=format&fit=crop")' }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-sfNavy/90 via-sfNavy/50 to-transparent"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full flex flex-col md:flex-row justify-between items-center gap-8">
          
          {/* Textos à esquerda */}
          <div className="text-white max-w-2xl">
            <div className="bg-sfTeal inline-block px-4 py-1 mb-6 rounded-sm">
              <span className="font-bold text-sfCream uppercase tracking-widest text-sm">Últimos dias</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black leading-tight tracking-tighter mb-4">
              Pare de <br/> mentir
            </h1>
            <p className="text-3xl md:text-4xl font-light italic text-sfCream mb-8">
              e comece a treinar hoje.
            </p>
          </div>

          {/* Box Flutuante à direita */}
          <div className="bg-white text-sfNavy p-8 md:p-10 shadow-2xl max-w-sm w-full border-b-8 border-sfTeal transform md:translate-y-10">
            <h3 className="font-black text-2xl uppercase text-center mb-2">Matricule-se</h3>
            <p className="text-center font-bold text-sfTeal mb-6">Planos a partir de</p>
            <div className="text-center mb-8">
              <span className="text-2xl font-bold">R$</span>
              <span className="text-7xl font-black tracking-tighter text-sfNavy">89</span>
              <span className="text-3xl font-bold">,90</span>
              <p className="text-xs uppercase font-bold text-gray-500 mt-1">* no plano básico</p>
            </div>
            <Link to="/matricula" className="block w-full bg-sfTeal text-sfCream text-center py-4 text-xl font-black uppercase hover:bg-sfNavy transition">
              Garantir Oferta
            </Link>
          </div>

        </div>
      </section>

      {/* SEÇÃO CARROSSEL */}
      <section className="py-20 bg-sfCream dark:bg-sfBlack px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-sfNavy dark:text-sfCream uppercase tracking-tight">
              Por que se <span className="text-sfTeal dark:text-sfGreen">matricular?</span>
            </h2>
            <p className="mt-4 text-lg text-sfTeal dark:text-gray-300 font-medium">
              A melhor estrutura para o seu resultado.
            </p>
          </div>

          {/* Estrutura do Carrossel */}
          <div className="relative w-full max-w-5xl mx-auto h-[400px] md:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
            <div 
              className="w-full h-full bg-cover bg-center transition-all duration-500"
              style={{ backgroundImage: `url(${IMAGENS_CARROSSEL[slideAtual]})` }}
            >
              <div className="absolute inset-0 bg-sfBlack bg-opacity-20 hover:bg-opacity-10 transition"></div>
            </div>
            
            {/* Controles do Carrossel */}
            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-sfNavy/70 text-white p-3 rounded-full hover:bg-sfTeal transition"
            >
              <ChevronLeft size={30} />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-sfNavy/70 text-white p-3 rounded-full hover:bg-sfTeal transition"
            >
              <ChevronRight size={30} />
            </button>

            {/* Indicadores (Bolinhas) */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
              {IMAGENS_CARROSSEL.map((_, index) => (
                <button 
                  key={index} 
                  onClick={() => setSlideAtual(index)}
                  className={`w-3 h-3 rounded-full transition-all ${index === slideAtual ? 'bg-sfGreen scale-125' : 'bg-sfCream/50'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}