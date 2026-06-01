# 💪 StrongFit Academy — Sistema de Planos, Matrícula & Portal do Aluno

Bem-vindo ao repositório do **Sistema de Academia StrongFit**, uma aplicação web front-end completa construída para demonstrar a sinergia entre o desenvolvimento de interfaces modernas e a observabilidade avançada na prática. 

A interface é fortemente inspirada no ecossistema digital da rede de academias **Bluefit**, trazendo uma proposta altamente visual, focada em conversão, tipografia robusta baseada na fonte *Montserrat*, carrossel dinâmico de aulas, dashboard interativo e uma experiência rica em regras de negócio e feedbacks.

---

## 🚀 Tecnologias Utilizadas

O ecossistema técnico do projeto foi selecionado para garantir máxima performance, escalabilidade de componentes e carregamento assíncrono (*code-splitting*) monitorável:

- **React 18+**: Componentes funcionais robustos e gerenciamento otimizado de ciclo de vida com Hooks.
- **Vite**: Bundler de altíssima velocidade para o ambiente de desenvolvimento.
- **React Router DOM v6**: Gerenciamento de rotas declarativas com suporte a carregamento preguiçoso (`React.lazy` e `Suspense`).
- **Zustand**: Gerenciamento de estado global leve e performático (controle de sessões e temas).
- **Tailwind CSS v3**: Estilização baseada em utilitários, paleta de cores customizada e responsividade avançada.
- **Lucide React**: Pacote de ícones vetoriais modernos e limpos.
- **React Hot Toast**: Biblioteca para notificações flutuantes (Toasts) elegantes e dinâmicas.
- **Banco de Dados Local (Simulado)**: Persistência integral de dados do usuário, fichas de treino e inscrições de aulas via `localStorage`.
- **Dynatrace RUM (Real User Monitoring)**: Instrumentação completa do ciclo de vida da aplicação para captura de sessões, ações de engajamento e exceções JavaScript.

---

## 📂 Estrutura Completa de Arquivos

Abaixo está a árvore estrutural do projeto atualizada, organizada por responsabilidades técnicas isoladas:

```text
strongfit/
├── index.html                  # Ponto de entrada HTML & Injeção da Tag Dynatrace e Fontes
├── package.json                # Gerenciador de dependências e scripts npm
├── tailwind.config.js          # Configuração da Paleta de Cores, Dark Mode e Fontes
├── postcss.config.js           # Plugin para processamento do Tailwind CSS
├── dynatrace-setup.md          # Manual de validação de métricas no painel Dynatrace
└── src/
    ├── main.jsx                # Inicialização do React e vinculação do RouterProvider
    ├── index.css               # Diretivas estruturais básicas do Tailwind CSS
    ├── App.jsx                 # Layout principal do app, Toaster e Error Boundary
    ├── router.jsx              # Configuração de Code-Splitting e mapeamento de URLs
    ├── data/
    │   └── aulas.js            # Banco de dados estático simulando uma API de Aulas
    ├── store/
    │   └── useStore.js         # Estado global (Sessão de autenticação e Dark Mode)
    ├── hooks/
    │   └── useDynatrace.js     # Custom hook para envio de User Actions e Report de Erros
    ├── utils/
    │   └── validators.js       # Algoritmos de validação real de CPF e cálculo de idade
    ├── components/
    │   ├── Navbar.jsx          # Barra de navegação dinâmica responsiva (Estilo Bluefit)
    │   └── ErrorBoundary.jsx   # Capturador global de falhas críticas de JS
    └── pages/
        ├── Home.jsx            # Landing Page com Hero, Carrossel de Aulas Automático e CTAs
        ├── Planos.jsx          # Cards de planos, simulação e botões inteligentes de contratação
        ├── Matricula.jsx       # Formulário com validações de negócio e segurança de idade
        ├── Aulas.jsx           # Catálogo de modalidades com barra de busca e filtragem
        ├── AulaDetalhe.jsx     # Página dedicada de cada aula, com regras de limite de inscrição
        └── Aluno.jsx           # Dashboard interativo com benefícios, ficha de treino e aulas salvas
🛠️ Explicação Detalhada das Funcionalidades
🟢 src/pages/ (Regras de Negócio & Telas)
Home.jsx: Seção de impacto inicial. Contém o Hero promocional com preço de conversão rápida e um Carrossel Automático de Aulas construído nativamente com useRef e scroll-snap, permitindo navegação por clique, arraste (mobile) ou tempo.

Planos.jsx: Apresenta os planos e a função de Simulação. Conta com lógica de proteção de sessão: se o aluno já estiver logado, o sistema impede a recompra do mesmo plano ou direciona inteligentemente para a tela de upgrade interno.

Aulas.jsx e AulaDetalhe.jsx: Um catálogo completo filtrável. A página de detalhes aplica regras de negócio avançadas baseadas no Ticket do usuário: alunos do plano Básico só podem reservar 2 aulas, Premium até 5 e Black possui acesso ilimitado. O sistema bloqueia abusos e notifica o Dynatrace.

Matricula.jsx: Executa validação algorítmica real do CPF (com dígitos verificadores) e bloqueia o plano Black para menores de 18 anos, disparando alertas customizados para o monitoramento caso ocorram falhas.

Aluno.jsx: O Dashboard completo.

Benefícios Dinâmicos: Mapeia visualmente o que o aluno tem direito.

Ficha de Treino: CRUD completo local onde o aluno constrói seu próprio treino.

Gestão de Inscrições: Permite ao aluno visualizar suas aulas agendadas e realizar cancelamentos.

Segurança: Desloga automaticamente o usuário após 5 minutos de inatividade (sem movimentos ou cliques).

🟡 Observabilidade (hooks/useDynatrace.js)
Centraliza a lógica de comunicação com o agente do Dynatrace (dtrum). Expõe funções para telemetria de cliques (sendAction) e mapeamento de exceções lógicas ou travamentos (reportError).

🏎️ Instruções de Instalação e Execução
Siga a ordem de comandos abaixo no seu terminal para rodar o projeto localmente:

1. Clonar ou Inicializar o Repositório

npm create vite@latest strongfit -- --template react
cd strongfit

2. Instalar as Dependências Estruturais e Complementares

npm install
npm install react-router-dom zustand react-hot-toast lucide-react

3. Instalar e Inicializar o Tailwind CSS (v3)

npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss@3 init -p

4. Inicializar o Servidor de Desenvolvimento

npm run dev
Abra o navegador e acesse a URL local indicada no terminal, geralmente: http://localhost:5173/

📊 Métricas Monitoradas no Dynatrace
Ao navegar pela aplicação, as interações alimentam o painel de telemetria do Dynatrace para responder perguntas estratégicas de negócio, performance e engajamento:

Funil de Conversão: Acompanhamento desde home_acesso, visualização de aulas (aula_detalhe_acesso) até a matricula_submetida.

Saúde Financeira e Up-sells: Monitoramento dos botões de simular_plano e trocar_plano diretamente na área logada do aluno.

Engajamento (Dashboard): Métricas como aluno_checkin_realizado e a taxa de uso do abrir_montador_treino ajudam a prever retenção vs. churn.

Erros de Validação e Limites: Eventos de erro_limite_inscricao_aula identificam alunos que estão "batendo no teto" do seu plano atual (excelente público para campanhas de upgrade).

Segurança de Sessão: Exceções tratadas como sessao_expirada por inatividade do lado do cliente.