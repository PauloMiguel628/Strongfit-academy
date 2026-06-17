# 💪 StrongFit Academy — Sistema de Planos, Matrícula & Portal do Aluno

Bem-vindo ao repositório do **Sistema de Academia StrongFit**, uma aplicação web front-end completa construída para demonstrar a sinergia entre o desenvolvimento de interfaces modernas e a observabilidade avançada na prática. 

A interface possui uma proposta altamente visual, focada em conversão, tipografia robusta baseada na fonte *Montserrat*, carrossel dinâmico de aulas, rede de unidades filtrável, dashboard interativo com autenticação e uma experiência rica em regras de negócio e feedbacks.

---

## 🚀 Tecnologias Utilizadas

O ecossistema técnico do projeto foi selecionado para garantir máxima performance, escalabilidade de componentes e carregamento assíncrono (*code-splitting*) monitorável:

- **React 18+**: Componentes funcionais robustos e gerenciamento otimizado de ciclo de vida com Hooks.
- **Vite**: Bundler de altíssima velocidade para o ambiente de desenvolvimento.
- **React Router DOM v6**: Gerenciamento de rotas declarativas com suporte a carregamento preguiçoso (`React.lazy` e `Suspense`).
- **Zustand**: Gerenciamento de estado global leve e performático, utilizando `persist` para salvamento automático da sessão (Login) e preferências de tema no `localStorage`.
- **Tailwind CSS v3**: Estilização baseada em utilitários, paleta de cores customizada, suporte a Dark Mode e responsividade avançada.
- **Lucide React**: Pacote de ícones vetoriais modernos e limpos.
- **React Hot Toast**: Biblioteca para notificações flutuantes (Toasts) elegantes e dinâmicas.
- **Banco de Dados Local (Simulado)**: Persistência integral de dados do usuário, credenciais de login, unidades, fichas de treino e inscrições de aulas via `localStorage`.
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
    │   ├── aulas.js            # Banco estático simulando uma API de Aulas Coletivas
    │   └── unidades.js         # Banco estático simulando as unidades da rede de academias
    ├── store/
    │   └── useStore.js         # Estado global (Autenticação persistida e Dark Mode)
    ├── hooks/
    │   └── useDynatrace.js     # Custom hook para envio de User Actions e Report de Erros
    ├── utils/
    │   └── validators.js       # Algoritmos de validação real de CPF e cálculo de idade
    ├── components/
    │   ├── Navbar.jsx          # Barra de navegação responsiva com menu mobile e controle de sessão
    │   └── ErrorBoundary.jsx   # Capturador global de falhas críticas de JS
    └── pages/
        ├── Home.jsx            # Landing Page com Hero, Carrossel de Aulas Automático e CTAs
        ├── Unidades.jsx        # Catálogo regionalizado de unidades com motor de busca textual
        ├── UnidadeDetalhe.jsx  # Galeria de fotos, horários e mapas específicos da unidade
        ├── Planos.jsx          # Cards de planos, simulação e botões inteligentes de contratação
        ├── Matricula.jsx       # Formulário complexo, criação de senha e resumo financeiro dinâmico
        ├── Login.jsx           # Tela de autenticação integrada com o banco local
        ├── Aulas.jsx           # Catálogo de modalidades com barra de busca e filtragem
        ├── AulaDetalhe.jsx     # Página dedicada com regras de limite de inscrição por plano
        └── Aluno.jsx           # Dashboard interativo protegido, CRUD de treinos e gestão de plano

🛠️ Explicação Detalhada das Funcionalidades

🟢 src/pages/ (Regras de Negócio & Telas)

Home.jsx: Seção de impacto inicial. Contém o Hero promocional com preço de conversão rápida e um Carrossel Automático de Aulas construído nativamente com useRef e scroll-snap.

Unidades.jsx e UnidadeDetalhe.jsx: Nova etapa no funil de vendas. Permite aos usuários localizarem a academia mais próxima através de um filtro de busca. A página de detalhes exibe uma galeria de fotos dinâmica e opções de navegação (Maps/Waze), direcionando o usuário para a escolha do plano associado àquela unidade.

Planos.jsx: Apresenta os planos e a função de Simulação. Conta com lógica de proteção de sessão: se o aluno já estiver logado, o sistema impede a recompra ou direciona para a tela de upgrade interno.

Matricula.jsx: Motor de conversão completo. Executa validação de CPF, restrição de idade (Plano Black) e agora inclui um Resumo Financeiro Dinâmico que atualiza preços conforme a seleção, além da etapa de criação e confirmação de senha para o portal.

Login.jsx: Autenticação que verifica as credenciais cruzando CPF e Senha criados na matrícula.

Aulas.jsx e AulaDetalhe.jsx: Catálogo filtrável. A página de detalhes aplica regras avançadas baseadas no plano do usuário: Básico (2 aulas), Premium (5 aulas) e Black (Ilimitado).

Aluno.jsx: O Dashboard completo, protegido por rotas.

Benefícios Dinâmicos: Mapeia visualmente os direitos do plano.

Ficha de Treino: CRUD completo salvo localmente.

Gestão de Inscrições: Permite ao aluno cancelar aulas reservadas.

Segurança: Monitora a inatividade e encerra a sessão (logout automático) após 5 minutos.

🟡 Observabilidade (hooks/useDynatrace.js)

Centraliza a lógica de comunicação com o agente do Dynatrace (dtrum). Expõe funções para telemetria de cliques (sendAction) e mapeamento de exceções lógicas ou travamentos (reportError).

🏎️ Instruções de Instalação e Execução

Siga a ordem de comandos abaixo no terminal para rodar o projeto localmente:

Clonar o Repositório

https://github.com/PauloMiguel628/Strongfit-academy.git

cd strongfit

Instalar as Dependências Estruturais

npm install

Inicializar o Servidor de Desenvolvimento

npm run dev
Abra o navegador e acesse a URL local

📊 Métricas Monitoradas no Dynatrace

Ao navegar pela aplicação, as interações alimentam o painel de telemetria do Dynatrace para responder perguntas estratégicas:

Novo Funil Regionalizado: Acompanhamento de unidades_acesso, unidade_detalhe_acesso e como isso impacta na matricula_submetida.

Saúde Financeira e Up-sells: Monitoramento dos botões de simulação e trocar_plano na área logada.

Engajamento e Login: Sucessos e falhas de login (login_sucesso vs login_erro_credenciais), acompanhados da taxa de uso de ferramentas internas (montador de treino, check-in).

Erros de Validação e Limites: Identificação de alunos "batendo no teto" do plano atual ou encontrando atritos no checkout (ex: senhas não coincidem, CPF inválido).
