import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDynatrace } from '../hooks/useDynatrace';

const PLANOS = [
  { id: 'Basico', nome: 'Plano Básico', preco: 89.90, desc: 'Acesso livre a equipamentos.' },
  { id: 'Premium', nome: 'Plano Premium', preco: 129.90, desc: 'Equipamentos + Aulas coletivas.' },
  { id: 'Black', nome: 'Plano Black', preco: 199.90, desc: 'Tudo acima + Consultoria nutricional.' }
];

export default function Planos() {
  const navigate = useNavigate();
  const { sendAction } = useDynatrace();
  const [modalSimulacao, setModalSimulacao] = useState(null);

  const handleSimular = (plano, meses) => {
    sendAction('simular_plano', { plano: plano.nome, duracaoMeses: meses });
    setModalSimulacao({ ...plano, meses, total: plano.preco * meses });
  };

  const handleContratar = (planoId) => {
    sendAction('contratar_click', { plano: planoId });
    navigate('/matricula', { state: { planoPreSelecionado: planoId } });
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-center">Escolha seu Plano</h2>
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {PLANOS.map(plano => (
          <div key={plano.id} className="border border-sfTeal rounded-lg p-6 flex flex-col justify-between dark:bg-sfNavy">
            <div>
              <h3 className="text-2xl font-bold">{plano.nome}</h3>
              <p className="text-3xl text-sfGreen my-4">R$ {plano.preco.toFixed(2).replace('.', ',')}<span className="text-sm">/mês</span></p>
              <p className="mb-6">{plano.desc}</p>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => handleSimular(plano, 12)} className="bg-sfTeal text-sfCream py-2 rounded">Simular (12 meses)</button>
              <button onClick={() => handleContratar(plano.id)} className="bg-sfGreen text-sfNavy font-bold py-2 rounded">Contratar</button>
            </div>
          </div>
        ))}
      </div>

      {modalSimulacao && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-sfCream dark:bg-sfBlack p-6 rounded-lg max-w-sm w-full border border-sfTeal">
            <h3 className="text-xl font-bold mb-4">Simulação: {modalSimulacao.nome}</h3>
            <p>Duração: {modalSimulacao.meses} meses</p>
            <p className="text-2xl font-bold text-sfGreen mt-2">Total: R$ {modalSimulacao.total.toFixed(2).replace('.', ',')}</p>
            <button onClick={() => setModalSimulacao(null)} className="mt-6 w-full bg-sfNavy text-sfCream py-2 rounded">Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}