import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDynatrace } from '../hooks/useDynatrace';
import { validateCPF, calculateAge } from '../utils/validators';
import { useStore } from '../store/useStore';

export default function Matricula() {
  const location = useLocation();
  const navigate = useNavigate();
  const { sendAction, reportError } = useDynatrace();
  const login = useStore(state => state.login);

  const [formData, setFormData] = useState({
    nome: '', email: '', cpf: '', telefone: '',
    plano: location.state?.planoPreSelecionado || 'Basico',
    dataNascimento: '', termos: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.termos) {
      toast.error('Você deve aceitar os termos.');
      sendAction('matricula_erro_validacao', { erro: 'Termos nao aceitos' });
      return;
    }

    try {
      if (!validateCPF(formData.cpf)) {
        throw new Error(`CPF ${formData.cpf} inválido.`);
      }
    } catch (error) {
      reportError('CPF inválido', error, { cpfDigitado: formData.cpf });
      sendAction('matricula_erro_cpf');
      toast.error(error.message);
      return;
    }

    try {
      const idade = calculateAge(formData.dataNascimento);
      if (formData.plano === 'Black' && idade < 18) {
        throw new Error("Plano Black não disponível para menores de 18 anos.");
      }
    } catch (error) {
      reportError('Plano indisponível', error, { plano: formData.plano, dataNascimento: formData.dataNascimento });
      sendAction('matricula_erro_plano', { plano: formData.plano });
      toast.error(error.message);
      return;
    }

    // Sucesso
    const alunos = JSON.parse(localStorage.getItem('academia_alunos') || '[]');
    const novoAluno = { ...formData, id: Date.now().toString(), dataMatricula: new Date().toISOString() };
    alunos.push(novoAluno);
    localStorage.setItem('academia_alunos', JSON.stringify(alunos));
    
    sendAction('matricula_submetida', { plano: formData.plano });
    login(novoAluno.id);
    toast.success('Matrícula realizada com sucesso!');
    navigate('/aluno');
  };

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-sfNavy p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Finalizar Matrícula</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input required type="text" placeholder="Nome Completo" className="p-2 border rounded dark:text-sfBlack" onChange={e => setFormData({...formData, nome: e.target.value})} />
        <input required type="email" placeholder="E-mail" className="p-2 border rounded dark:text-sfBlack" onChange={e => setFormData({...formData, email: e.target.value})} />
        <input required type="text" placeholder="CPF (Ex: 123.456.789-00)" className="p-2 border rounded dark:text-sfBlack" onChange={e => setFormData({...formData, cpf: e.target.value})} />
        <input required type="text" placeholder="Telefone" className="p-2 border rounded dark:text-sfBlack" onChange={e => setFormData({...formData, telefone: e.target.value})} />
        <input required type="date" className="p-2 border rounded dark:text-sfBlack" onChange={e => setFormData({...formData, dataNascimento: e.target.value})} />
        
        <select value={formData.plano} onChange={e => setFormData({...formData, plano: e.target.value})} className="p-2 border rounded dark:text-sfBlack">
          <option value="Basico">Plano Básico</option>
          <option value="Premium">Plano Premium</option>
          <option value="Black">Plano Black</option>
        </select>

        <label className="flex items-center gap-2">
          <input type="checkbox" onChange={e => setFormData({...formData, termos: e.target.checked})} />
          Li e aceito os termos
        </label>

        <button type="submit" className="bg-sfTeal text-sfCream py-3 rounded font-bold hover:bg-sfNavy transition">Concluir Matrícula</button>
      </form>
    </div>
  );
}