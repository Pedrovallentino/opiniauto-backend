# OpiniAuto - API

Este projeto é a API backend do sistema OpiniAuto, desenvolvida para gerenciar avaliações de veículos, usuários e autenticação.

## 🚀 Tecnologias e Arquitetura

A API foi construída utilizando tecnologias modernas e práticas de desenvolvimento sólidas:

*   **Node.js & Fastify**: Escolhidos pela alta performance e baixo overhead.
*   **TypeScript**: Para tipagem estática e maior segurança no desenvolvimento.
*   **Prisma ORM**: Facilita a interação com o banco de dados PostgreSQL, garantindo type-safety.
*   **PostgreSQL**: Banco de dados relacional robusto para persistência dos dados.
*   **Zod**: Utilizado para validação de esquemas de entrada (request body, params) e saída, integrado com o Fastify.
*   **Vitest**: Framework de testes unitários e de integração, rápido e compatível com Jest.
*   **JWT (JSON Web Tokens)**: Para autenticação stateless segura.
*   **SOLID**: Princípios de design de software aplicados, especialmente Injeção de Dependência (nos Services e Controllers) e Responsabilidade Única.

### Decisões Arquiteturais

1.  **Separação de Camadas**:
    *   **Controllers (HTTP)**: Lidam apenas com a requisição/resposta HTTP, validação de entrada e chamam os serviços.
    *   **Services (Business Logic)**: Contêm toda a regra de negócio da aplicação. São independentes de framework HTTP e de banco de dados (recebem repositórios via interface).
    *   **Repositories (Data Access)**: Abstraem o acesso aos dados. Temos implementações `Prisma` (produção) e `InMemory` (testes).

2.  **Injeção de Dependência**:
    *   Os serviços recebem suas dependências (repositórios) no construtor. Isso permite trocar facilmente a implementação do banco de dados (ex: de Prisma para InMemory) durante os testes, sem alterar a lógica de negócio.

3.  **Repository Pattern**:
    *   Define contratos (interfaces) para acesso a dados. Isso desacopla a aplicação do ORM específico e facilita testes.

4.  **Factory Pattern (Implícito)**:
    *   Nos controllers, instanciamos as dependências necessárias (Repository -> Service) para executar a ação.

### 📂 Estrutura de Pastas

A organização do projeto segue uma estrutura modular baseada em responsabilidades:

```
src/
├── @types/              # Definições de tipos TypeScript globais (ex: extensão do JWT)
├── config/              # Configurações globais (variáveis de ambiente, etc.)
├── domain/              # Entidades e interfaces de domínio
├── http/                # Camada de entrada HTTP
│   ├── controllers/     # Controladores (lidam com requisição/resposta)
│   ├── middlewares/     # Middlewares (autenticação, validação, logs)
│   └── routes/          # Definição de rotas e schemas (Swagger/Zod)
├── infra/               # Infraestrutura externa
│   └── database/        # Configuração do banco de dados (Prisma Client)
├── repositories/        # Camada de acesso a dados
│   ├── in-memory/       # Implementações em memória para testes
│   └── prisma/          # Implementações reais usando Prisma
├── services/            # Camada de regras de negócio (Casos de Uso)
│   └── [module]/        # Agrupados por módulo (auth, cars, evaluations)
├── app.ts               # Configuração da aplicação Fastify (plugins, rotas)
└── server.ts            # Ponto de entrada (start do servidor)
```

## 🛠️ Configuração e Instalação

### Pré-requisitos
*   Node.js (v18+)
*   PostgreSQL (Local ou Docker)

### Instalação

1.  Clone o repositório.
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Configure as variáveis de ambiente:
    Crie um arquivo `.env` na raiz baseado no exemplo:
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/opiniauto"
    JWT_SECRET="sua_chave_secreta_super_segura"
    PORT=3333
    ```
4.  Execute as migrações do banco de dados:
    ```bash
    npx prisma migrate dev
    ```

## ▶️ Execução

*   **Desenvolvimento**:
    ```bash
    npm run dev
    ```
*   **Produção**:
    ```bash
    npm run build
    npm start
    ```

## 🧪 Testes

O projeto possui uma suíte de testes abrangente cobrindo serviços e controladores principais.

*   Executar todos os testes:
    ```bash
    npm test
    # ou
    npx vitest run
    ```

### Cobertura de Testes
*   **Services**: Testes unitários com repositórios em memória para validar regras de negócio isoladas.
*   **Controllers (E2E)**: Testes de integração simulando requisições HTTP reais para garantir que a API responda corretamente (incluindo autenticação e permissões).

## 🔒 Segurança

*   **Autenticação JWT**: Rotas protegidas exigem um token Bearer válido.
*   **RBAC (Role-Based Access Control)**: Middleware `verifyRole` protege rotas administrativas (ex: criar/editar carros) apenas para usuários com perfil `ADMIN`.
*   **Validação de Dados**: Zod garante que nenhum dado inválido chegue à camada de serviço.
*   **CORS**: Configurado para permitir apenas métodos seguros e origens confiáveis (configurável via `app.ts`).
*   **Hashing de Senha**: Senhas são armazenadas com hash bcrypt.

## 📝 Endpoints Principais

A documentação completa (Swagger) está disponível em `/docs` quando a aplicação está rodando.

*   **Auth**: `/auth/register`, `/auth/sessions`, `/auth/refresh`
*   **Cars (Public)**: `GET /cars`, `GET /cars/:id`
*   **Cars (Admin)**: `POST /cars`, `PUT /cars/:id`, `DELETE /cars/:id`, `PATCH /cars/:id/status`
*   **Evaluations**: `POST /cars/:id/evaluations`, `GET /cars/:id/evaluations`
