# Integração Dynatrace - StrongFit Academy

Este documento explica como habilitar e validar o RUM (Real User Monitoring) do Dynatrace na aplicação.

## 1. Injeção do Agent
Vá até a console do Dynatrace > *Deploy Dynatrace* > *Set up Agentless or Agent-based RUM*.
Gere a tag JavaScript para injeção manual. 
Copie o snippet `<script src="..."></script>` e cole no arquivo `index.html` da aplicação, substituindo a linha:
`<!-- __DYNATRACE_SCRIPT__ -->`

## 2. Ações Instrumentadas (User Actions)

A aplicação envia eventos customizados através do Hook `useDynatrace`. Você poderá montar dashboards no Dynatrace filtrando por essas *Custom Actions* para entender o comportamento de navegação e retenção:

**Funil de Vendas (Home, Aulas e Matrícula):**
- `home_acesso`: Disparada ao montar a tela Home inicial.
- `aulas_acesso`: Visualização do catálogo geral de modalidades.
- `aula_detalhe_acesso`: Possui a propriedade `aulaNome` para saber quais aulas geram mais interesse.
- `simular_plano`: Possui as propriedades `plano` e `duracaoMeses`.
- `contratar_click`: Possui a propriedade `plano`.
- `matricula_submetida`: Ação chave para o funil de conversão.

**Engajamento e Retenção (Área do Aluno):**
- `aluno_dashboard_acesso`: Acesso à área restrita (carrega a propriedade do `plano` atual do usuário para cruzar dados de acesso vs ticket).
- `aluno_checkin_realizado`: Evento crucial para medir a assiduidade dos alunos na academia. Pode ser cruzado com cancelamentos.
- `abrir_montador_treino`: Cliques na intenção de criar um treino novo.
- `treino_exercicio_adicionado`: Submissão do formulário do treino. Carrega a propriedade `exercicio` para descobrir quais são os aparelhos/exercícios mais disputados na academia.
- `treino_exercicio_removido`: Remoção de itens da lista de treinos.
- `trocar_plano`: Função de *Up-sell*. Carrega `planoAntigo` e `novoPlano`.

## 3. Captura de Erros e Exceções Tratadas
Os seguintes erros JS intencionais foram mapeados via `dtrum.reportCustomError`:
- **CPF Inválido**: Exceção lançada no front-end para evitar dados falsos. Capturada como `"CPF inválido"`.
- **Restrição de Idade**: Ao selecionar o plano Black com idade menor que 18 anos (`"Plano indisponível"`).
- **Sessão Expirada**: Disparada automaticamente se não houver interação do mouse/teclado por 5 minutos na rota `/aluno`.
- **Plano já atual**: Exceção lançada quando o usuário clica em trocar para o mesmo plano que já possui.

## 4. Como validar os dados no Dynatrace
Após rodar a aplicação localmente (`npm run dev`) e interagir com ela:
1. Acesse *Applications* > Selecione sua aplicação no Dynatrace.
2. Navegue até a aba **User Actions** para validar a contagem dos eventos (ex: `simular_plano` vs `matricula_submetida`).
3. Verifique a aba **Errors** > **JavaScript Errors**. Você deve enxergar os erros de Validação de CPF e Sessão Expirada reportados explicitamente pela aplicação.