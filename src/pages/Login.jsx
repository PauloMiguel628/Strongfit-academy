import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useStore } from '../store/useStore';
import { useDynatrace } from '../hooks/useDynatrace';
import { Lock, User } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useStore();
  const { sendAction, reportError } = useDynatrace();
  
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');

  useEffect(() => {
    sendAction('login_acesso');
  }, [sendAction]);

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Limpa a formatação do CPF para comparar apenas os números
    const cpfLimpo = cpf.replace(/[^\d]+/g, '');

    if (!cpfLimpo || !senha) {
      toast.error('Preencha seu CPF e senha.');
      return;
    }

    try {
      const alunos = JSON.parse(localStorage.getItem('academia_alunos') || '[]');
      
      // Busca o aluno que tenha o mesmo CPF e a mesma senha
      const alunoEncontrado = alunos.find(
        a => a.cpf.replace(/[^\d]+/g, '') === cpfLimpo && a.senha === senha
      );

      if (alunoEncontrado) {
        sendAction('login_sucesso');
        toast.success(`Bem-vindo de volta, ${alunoEncontrado.nome.split(' ')[0]}!`);
        login({ alunoId: alunoEncontrado.id, nome: alunoEncontrado.nome });
        navigate('/aluno');
      } else {
        sendAction('login_erro_credenciais');
        toast.error('CPF ou senha incorretos. Tente novamente.');
      }
    } catch (error) {
      reportError('erro_processamento_login', error);
      toast.error('Ocorreu um erro ao tentar fazer login.');
    }
  };

  return (
    <div className="-m-4 md:-m-8 relative min-h-[90vh] flex items-center justify-center bg-sfBlack overflow-hidden">
      {/* Background Imersivo */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop")' }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-t from-sfBlack via-sfNavy/80 to-transparent"></div>

      {/* Card de Login */}
      <div className="relative z-10 w-full max-w-md p-4">
        <div className="bg-white dark:bg-sfNavy p-8 md:p-10 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-sfNavy dark:text-white uppercase tracking-tight">
              Área do <span className="text-sfTeal dark:text-sfGreen">Aluno</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm font-medium">
              Acesse seu dashboard para gerenciar treinos e planos.
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Digite seu CPF" 
                value={cpf}
                maxLength="14"
                onChange={(e) => setCpf(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-sfBlack border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-sfTeal text-sfNavy dark:text-white font-medium"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="password" 
                placeholder="Sua senha" 
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-sfBlack border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-sfTeal text-sfNavy dark:text-white font-medium"
              />
            </div>

            <button 
              type="submit" 
              className="w-full mt-4 bg-sfTeal text-sfCream py-4 rounded-full font-black uppercase tracking-widest hover:bg-sfNavy transition shadow-lg"
            >
              Entrar
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Ainda não é aluno? <Link to="/unidades" className="text-sfTeal dark:text-sfGreen font-bold hover:underline">Matricule-se aqui</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}