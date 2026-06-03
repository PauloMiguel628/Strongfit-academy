import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDynatrace } from '../hooks/useDynatrace';
import { LISTA_UNIDADES } from '../data/unidades';

// Dicionário de preços para o resumo dinâmico
const PRECOS_PLANOS = {
  Basico: 89.90,
  Premium: 129.90,
  Black: 199.90
};

// Funções de validação de negócio
const calcularIdade = (dataNasc) => {
  const hoje = new Date();
  const nasc = new Date(dataNasc);
  let idade = hoje.getFullYear() - nasc.getFullYear();
  const m = hoje.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
  return idade;
};

const validarCPF = (cpf) => {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  let soma = 0, resto;
  for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  resto = (soma * 10) % 11;
  if ((resto === 10) || (resto === 11)) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;
  soma = 0;
  for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  resto = (soma * 10) % 11;
  if ((resto === 10) || (resto === 11)) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;
  return true;
};

export default function Matricula() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sendAction, reportError } = useDynatrace();

  const [formData, setFormData] = useState({
    nome: '', email: '', cpf: '', telefone: '',
    plano: location.state?.planoPreSelecionado || 'Basico',
    unidade: location.state?.unidadeId || '',
    dataNascimento: '', senha: '', confirmarSenha: '', termos: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validarCPF(formData.cpf)) {
      toast.error('CPF inválido!');
      sendAction('matricula_erro_cpf');
      reportError('cpf_invalido', new Error('Falha na validação de CPF'));
      return;
    }

    if (formData.plano === 'Black' && calcularIdade(formData.dataNascimento) < 18) {
      toast.error('O plano Black é apenas para maiores de 18 anos.');
      sendAction('matricula_erro_plano', { plano: 'Black', motivo: 'Idade insuficiente' });
      return;
    }

    if (!formData.unidade) {
      toast.error('Por favor, selecione uma unidade.');
      return;
    }

    if (formData.senha.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      toast.error('As senhas não coincidem!');
      return;
    }

    const novoAluno = {
      id: Date.now().toString(),
      nome: formData.nome,
      email: formData.email,
      cpf: formData.cpf,
      telefone: formData.telefone,
      plano: formData.plano,
      unidade: formData.unidade,
      dataNascimento: formData.dataNascimento,
      senha: formData.senha 
    };

    const alunosSalvos = JSON.parse(localStorage.getItem('academia_alunos') || '[]');
    localStorage.setItem('academia_alunos', JSON.stringify([...alunosSalvos, novoAluno]));

    sendAction('matricula_submetida', { plano: formData.plano, unidade: formData.unidade });
    toast.success('Matrícula realizada! Faça login para acessar sua área.');
    
    navigate('/login');
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="bg-white dark:bg-sfNavy rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-100 dark:border-gray-800">
        <h2 className="text-3xl font-black text-sfNavy dark:text-sfCream mb-8 uppercase text-center">
          Finalizar <span className="text-sfTeal dark:text-sfGreen">Matrícula</span>
        </h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input required type="text" placeholder="Nome Completo" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} className="p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-sfTeal text-sfNavy font-medium" />
          <input required type="email" placeholder="E-mail" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-sfTeal text-sfNavy font-medium" />
          
          <div className="flex flex-col md:flex-row gap-5">
            <input required type="text" placeholder="CPF" maxLength="14" value={formData.cpf} onChange={e => setFormData({...formData, cpf: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-sfTeal text-sfNavy font-medium" />
            <input required type="text" placeholder="Telefone" value={formData.telefone} onChange={e => setFormData({...formData, telefone: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-sfTeal text-sfNavy font-medium" />
          </div>

          <div className="flex flex-col md:flex-row gap-5">
            <input required type="date" value={formData.dataNascimento} onChange={e => setFormData({...formData, dataNascimento: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-sfTeal text-sfNavy uppercase text-sm font-bold text-gray-500" />
            
            <select required value={formData.plano} onChange={e => setFormData({...formData, plano: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-sfTeal text-sfNavy font-bold uppercase text-sm cursor-pointer">
              <option value="Basico">Plano Básico</option>
              <option value="Premium">Plano Premium</option>
              <option value="Black">Plano Black</option>
            </select>
          </div>

          <select required value={formData.unidade} onChange={e => setFormData({...formData, unidade: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-sfTeal text-sfNavy font-bold uppercase text-sm cursor-pointer">
            <option value="" disabled>Selecione sua unidade</option>
            {LISTA_UNIDADES.map(u => (
              <option key={u.id} value={u.id}>{u.nome} - {u.endereco.split('-')[0]}</option>
            ))}
          </select>

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm font-bold text-gray-500 uppercase mb-4">Crie sua senha de acesso</p>
            <div className="flex flex-col md:flex-row gap-5">
              <input required type="password" placeholder="Senha (Mín. 6 caracteres)" value={formData.senha} onChange={e => setFormData({...formData, senha: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-sfTeal text-sfNavy font-medium" />
              <input required type="password" placeholder="Confirmar Senha" value={formData.confirmarSenha} onChange={e => setFormData({...formData, confirmarSenha: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-sfTeal text-sfNavy font-medium" />
            </div>
          </div>

          {/* NOVA ÁREA: Resumo Final Dinâmico */}
          <div className="mt-6">
            <h3 className="text-lg font-bold text-sfNavy dark:text-white mb-3">Resumo final</h3>
            <div className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
              <div className="p-5 bg-white dark:bg-sfBlack space-y-4">
                <div className="flex justify-between text-sm font-bold text-sfNavy dark:text-gray-300">
                  <span>1ª Mensalidade</span>
                  <span>R$ 9,90</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-sfNavy dark:text-gray-300 pb-4 border-b border-gray-100 dark:border-gray-800">
                  <span>Mensalidades seguintes</span>
                  <span>R$ {PRECOS_PLANOS[formData.plano].toFixed(2).replace('.', ',')}/mês</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-sfNavy dark:text-gray-300 pt-2">
                  <span>Matrícula</span>
                  <span>Grátis</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-sfNavy dark:text-gray-300">
                  <span>Anuidade</span>
                  <span>Grátis</span>
                </div>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-5 flex justify-between items-center">
                <span className="font-black text-sfNavy dark:text-white">Total a pagar</span>
                <span className="font-black text-sfNavy dark:text-white">R$ 9,90</span>
              </div>
            </div>
          </div>

          <label className="flex items-center gap-3 mt-4 cursor-pointer">
            <input required type="checkbox" checked={formData.termos} onChange={e => setFormData({...formData, termos: e.target.checked})} className="w-5 h-5 accent-sfTeal cursor-pointer" />
            <span className="text-sm text-gray-600 dark:text-gray-300">Concordo com os termos do contrato e política de privacidade.</span>
          </label>

          <button type="submit" className="mt-6 bg-sfTeal text-sfCream py-5 rounded-full font-black uppercase tracking-widest text-lg hover:bg-sfNavy transition shadow-lg">
            Concluir Assinatura
          </button>
        </form>
      </div>
    </div>
  );
}