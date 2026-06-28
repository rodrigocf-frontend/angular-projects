# TaskFlow

Aplicação de gerenciamento de tarefas no estilo Kanban, desenvolvida como projeto de portfólio com foco em boas práticas Angular modernas.

## Visão geral

TaskFlow permite organizar tarefas em colunas de status (A fazer, Em andamento, Concluído), com suporte a prioridades, filtros e progresso geral calculado automaticamente. O layout foi projetado para demonstrar domínio de arquitetura de componentes, reatividade com Signals e consumo de API REST.

## Stack

- **Angular 22** — standalone components, Signals, computed state
- **TypeScript 6** — tipagem estrita
- **RxJS** — streams para comunicação com a API
- **Angular HttpClient** — integração REST com interceptors de erro
- **Angular CDK** — drag and drop entre colunas do Kanban
- **Angular Reactive Forms** — criação e edição de tarefas
- **SCSS** — design tokens, sistema de temas via partials
- **json-server** — fake REST API para desenvolvimento local
- **Vitest** — testes unitários
- **Prettier + Husky** — formatação e git hooks
- **pnpm** — gerenciamento de pacotes

## Funcionalidades

- Quadro Kanban com 3 colunas e drag and drop
- Cards com prioridade (alta / média / baixa) e data de vencimento
- Indicador de tarefas atrasadas
- Barra de progresso geral calculada via `computed()` signal
- Filtros por prioridade, responsável e período
- Alternância entre view Kanban e lista
- Status bar com estado da API e branch atual

## Rodando localmente

**Pré-requisitos:** Node.js 20+, pnpm

```bash
# Instalar dependências
pnpm install

# Subir a fake API (porta 3000)
pnpm db-start

# Subir o app Angular (porta 4200)
pnpm start
```

Abra `http://localhost:4200` no navegador. A API estará disponível em `http://localhost:3000`.

## Scripts

| Comando | Descrição |
|---|---|
| `pnpm start` | Dev server Angular |
| `pnpm db-start` | json-server (fake API) |
| `pnpm build` | Build de produção |
| `pnpm test` | Testes unitários com Vitest |

## Estrutura

```
src/
├── app/
│   ├── components/       # Componentes compartilhados (sidebar, topbar...)
│   ├── pages/            # Views roteadas (board, list...)
│   └── services/         # TaskService, ProjectService
└── themes/
    ├── _tokens.scss      # Design tokens (cores, raios, espaçamentos)
    ├── _fonts.scss       # Import Inter
    └── _utils.scss       # Classes utilitárias
```

## Autor

**Rodrigo Cunha** — Dev Pleno  
[GitHub](https://github.com/falkneertb)
