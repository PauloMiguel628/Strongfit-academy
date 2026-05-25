# 💪 StrongFit Academy — Sistema de Planos & Matrícula

Bem-vindo ao repositório do **Sistema de Academia StrongFit**, uma aplicação web front-end simples construída para demonstrar a sinergia entre o desenvolvimento de interfaces modernas e a observabilidade avançada na prática. 

---

## 🚀 Tecnologias Utilizadas

O ecossistema técnico do projeto foi selecionado para garantir máxima performance, escalabilidade de componentes e carregamento assíncrono (*code-splitting*) monitorável:

- **React 18+**: Componentes funcionais robustos e gerenciamento otimizado de ciclo de vida com Hooks.
- **Vite**: Bundler de altíssima velocidade para o ambiente de desenvolvimento.
- **React Router DOM v6**: Gerenciamento de rotas declarativas com suporte a carregamento preguiçoso (`React.lazy` e `Suspense`).
- **Zustand**: Gerenciamento de estado global leve e performático (controle de Dark Mode e sessões).
- **Tailwind CSS v3**: Estilização baseada em utilitários e paleta de cores customizada.
- **Lucide React**: Pacote de ícones vetoriais modernos e responsivos.
- **React Hot Toast**: Biblioteca para notificações flutuantes (Toasts) elegantes e dinâmicas.
- **Banco de Dados Local (Simulado)**: Persistência integral de dados do usuário e timestamps via `localStorage`.
- **Dynatrace RUM (Real User Monitoring)**: Instrumentação completa do ciclo de vida da aplicação para captura de sessões, ações do usuário e exceções JavaScript.

---

## 📂 Estrutura Completa de Arquivos

Abaixo está a árvore estrutural do projeto organizada por responsabilidades técnicas isoladas:

```text
strongfit/
├── index.html                  # Ponto de entrada HTML & Injeção da Tag Dynatrace
├── package.json                # Gerenciador de dependências e scripts npm
├── tailwind.config.js          # Configuração da Paleta de Cores, Dark Mode e Fontes
├── postcss.config.js           # Plugin para processamento do Tailwind CSS
├── dynatrace-setup.md          # Manual de validação de métricas no painel Dynatrace
└── src/
    ├── main.jsx                # Inicialização do React e vinculação do RouterProvider
    ├── index.css               # Diretivas estruturais básicas do Tailwind CSS
    ├── App.jsx                 # Layout principal do app, Toaster e Error Boundary
    ├── router.jsx              # Configuração de Code-Splitting e caminhos de rotas
    ├── store/
    │   └── useStore.js         # Estado global (Sessão de autenticação e Dark Mode)
    ├── hooks/
    │   └── useDynatrace.js     # Custom hook para envio de User Actions e Report de Erros
    ├── utils/
    │   └── validators.js       # Algoritmos de validação real de CPF e cálculo de idade
    ├── components/
    │   ├── Navbar.jsx          # Barra de navegação responsiva 
    │   └── ErrorBoundary.jsx   # Capturador global de falhas críticas de JS
    └── pages/
        ├── Home.jsx            # Landing Page promocional com Hero e Carrossel
        ├── Planos.jsx          # Cards de planos e modal de simulação financeira
        ├── Matricula.jsx       # Formulário detalhado com validações de negócio
        └── Aluno.jsx           # Painel restrito do aluno com monitoramento de inatividade

        
        🛠️ Explicação Detalhada da Estrutura

🟢 src/components/
Navbar.jsx: Implementa o cabeçalho idêntico ao modelo de referência. Possui links dinâmicos e botões flutuantes que se adaptam caso o aluno esteja logado ou deslogado. Centraliza o botão alternador de Dark Mode que injeta a classe dark diretamente na raiz do documento.

ErrorBoundary.jsx: Um componente de classe do React que funciona como uma rede de segurança. Se qualquer falha inesperada acontecer em tempo de execução no front-end, ele previne a famosa "tela branca", exibe uma mensagem amigável e dispara o evento do erro diretamente para a API do Dynatrace.

🟡 src/hooks/
useDynatrace.js: Centraliza a lógica de comunicação com o agente do Dynatrace (dtrum). Expõe a função sendAction (para telemetria de cliques e conversões) e reportError (para mapear erros de validação). Possui salvaguardas internas caso o script do Dynatrace ainda não tenha sido carregado.

🔵 src/pages/
Home.jsx: Seção de impacto inicial. Contém o slogan promocional, caixa flutuante com preço de conversão rápida e um Carrossel de imagens dinâmico construído puramente em React que permite navegar pela infraestrutura da academia. Dispara o evento de carregamento home_acesso.

Planos.jsx: Apresenta os planos Básico, Premium e Black. Possui a funcionalidade de Simulação, abrindo um modal que calcula instantaneamente o custo acumulado em períodos de 6 ou 12 meses, notificando o Dynatrace através da action simular_plano.

Matricula.jsx: Formulário de alta fidelidade. Exige preenchimento correto e executa regras complexas de backend simuladas no cliente: validação algorítmica real do CPF (com dígitos verificadores) e bloqueio do plano Black para menores de 18 anos.

Aluno.jsx: Rota protegida. Verifica a existência de um ID válido em sessão. Implementa o detector de inatividade: se o usuário ficar 5 minutos sem mover o mouse, digitar ou clicar, a sessão é forçada a expirar, limpando os tokens e disparando um alerta de segurança para o monitoramento.

🟣 src/store/ e src/utils/
useStore.js: Utiliza Zustand para persistir em memória o estado do tema escuro e os dados mínimos do aluno logado, sincronizando mudanças com as chaves locais do navegador.

validators.js: Isola funções matemáticas complexas. O validador de CPF rejeita sequências repetidas (como 111.111.111-11) e aplica os multiplicadores aritméticos oficiais da Receita Federal.

🏎️ Instruções de Instalação e Execução
Siga rigorosamente a ordem de comandos abaixo no seu terminal para preparar e rodar o projeto do zero na sua máquina local:

1. Clonar ou Inicializar o Repositório
Se você estiver extraindo os arquivos em uma pasta criada manualmente, certifique-se de estar com o terminal apontado para dentro dela. Caso vá iniciar do zero, rode:

Bash
npm create vite@latest strongfit -- --template react
cd strongfit

2. Instalar as Dependências Estruturais do React
Instale os pacotes principais gerenciados pelo ciclo de vida do Vite:

Bash
npm install

3. Instalar os Módulos Complementares do Projeto
Execute o comando abaixo para baixar as ferramentas de rotas, ícones, estados globais e notificações:

Bash
npm install react-router-dom zustand react-hot-toast lucide-react

4. Instalar o Tailwind CSS na Versão Homologada (v3)
Para garantir compatibilidade com as diretivas e arquivos de configuração estruturados neste projeto, instale especificamente a versão 3 do Tailwind:

Bash
npm install -D tailwindcss@3 postcss autoprefixer

5. Inicializar os Arquivos de Configuração do CSS
Gere os arquivos estruturais de estilo rodando o inicializador associado à versão homologada:

Bash
npx tailwindcss@3 init -p

6. Configurar os Arquivos com o Código-Fonte
Abra a pasta do projeto no seu editor de código e realize as colagens de código fornecidas nas especificações anteriores nos respectivos arquivos:

Altere o tailwind.config.js incluindo as chaves content, darkMode e fontFamily.

Certifique-se de que o seu src/index.css contenha única e exclusivamente as 3 linhas diretivas do @tailwind.

Certifique-se de que o src/main.jsx use o componente <RouterProvider router={router} /> para evitar erros de contexto de navegação.

7. Inicializar o Servidor de Desenvolvimento
Com toda a estrutura salva, inicie o ecossistema local rodando:

Bash
npm run dev

Abra o navegador e acesse a URL local indicada no terminal, geralmente: http://localhost:5173/

📊 Métricas Monitoradas no Dynatrace

Ao navegar pela aplicação, as interações alimentam o painel de telemetria do Dynatrace para responder perguntas estratégicas de negócio e performance:

Taxa de Conversão de Planos: Comparativo volumétrico das ações simular_plano contra matricula_submetida segmentado pela propriedade do plano escolhido.

Abandono de Formulário: Mapeia a quantidade de acessos à página /matricula em relação aos envios de sucesso, evidenciando gargalos na jornada de checkout.

Erros de Entrada de Dados: Monitoramento em tempo real dos gatilhos matricula_erro_cpf e matricula_erro_plano, permitindo avaliar se a validação está muito complexa para o usuário.

Resiliência do Sistema: Captura automática de qualquer exceção não tratada capturada pelo ErrorBoundary da aplicação, amarrando a stack do erro à sessão real do usuário.