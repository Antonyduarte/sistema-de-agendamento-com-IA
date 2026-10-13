# SaaS de Agendamento com IA

Backend de uma plataforma de agendamentos construída com Node.js, Express e MySQL. A aplicação oferece autenticação, recuperação de senha, gerenciamento de agendamentos e permissões administrativas.

> Status: em desenvolvimento. Ainda são necessários testes, melhorias de segurança e preparação para produção.

## Funcionalidades

- Cadastro e login de usuários com JWT.
- Refresh token, logout e recuperação de senha por e-mail.
- Criação, consulta, edição e exclusão de agendamentos.
- Consulta pública de horários disponíveis.
- Rotas administrativas para consultar e excluir agendamentos.
- Servir a interface estática presente em `public/`.

## Tecnologias

Node.js · Express 5 · MySQL · mysql2 · bcrypt · JSON Web Token · Nodemailer · dotenv · CORS

## Requisitos

- Node.js e npm
- MySQL

## Instalação

```bash
git clone https://github.com/Antonyduarte/SaaS-de-agendamento-com-IA.git
cd SaaS-de-agendamento-com-IA
npm install
```

Crie o arquivo `.env` a partir de `.env.example` e preencha os dados do banco, JWT, CORS e e-mail.

## Variáveis de ambiente

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=sua_senha
DB_NAME=nome_do_banco

SERVER_PORT=3000
SECRET_KEY=sua_chave_jwt
CORS_ROUTE=http://localhost:3000

MAIL_USER=seu_email
MAIL_PASS=sua_senha_de_app
MAIL_HOST=seu_host_smtp
MAIL_PORT=587
```

Nunca versione o arquivo `.env`.

## Banco de dados

Execute os scripts SQL de `src/config/schema/` no banco configurado:

- `clientes.sql`
- `agendamentos.sql`
- `recovery_codes.sql`
- `refresh_tokens.sql`

## Execução

```bash
node src/server.js
```

Por padrão, a API fica disponível em `http://localhost:3000`. A pasta `public/` é servida pelo próprio Express.

## Arquitetura

O código é organizado por módulos e camadas:

```text
Route → Controller → Service → Repository → Database
```

Os módulos principais estão em `src/modules/`:

```text
src/
├── config/       # Banco, e-mail e schemas SQL
├── jobs/         # Tarefas automáticas
├── middlewares/  # Autenticação, autorização e erros
├── modules/      # Usuários e agendamentos
├── utils/        # Validações e respostas
├── app.js
└── server.js
```

## API

Base URL: `http://localhost:3000`

### Autenticação

| Método | Rota | Acesso |
| --- | --- | --- |
| `POST` | `/auth/register` | Público |
| `POST` | `/auth/login` | Público |
| `POST` | `/auth/forgot-password` | Público |
| `PUT` | `/auth/reset-password` | Público |
| `POST` | `/auth/refresh` | Público, com refresh token |
| `POST` | `/auth/logout` | Público, com refresh token |

Exemplo de cadastro:

```json
{
  "nome": "Maria Silva",
  "email": "maria@example.com",
  "senha": "senhaSegura123"
}
```

O token de acesso deve ser enviado nas rotas protegidas:

```http
Authorization: Bearer seu_token_jwt
```

### Agendamentos

| Método | Rota | Acesso |
| --- | --- | --- |
| `GET` | `/agendamento/disponiveis` | Público |
| `POST` | `/agendamento` | Usuário autenticado |
| `GET` | `/agendamento` | Usuário autenticado |
| `PUT` | `/agendamento` | Usuário autenticado |
| `DELETE` | `/agendamento/:id` | Usuário autenticado |
| `GET` | `/agendamento/admin` | Administrador |
| `DELETE` | `/agendamento/admin/delete/:id` | Administrador |

Exemplo de agendamento:

```json
{
  "nome": "Consulta",
  "data": "2026-07-20",
  "hora": "14:30:00"
}
```

O intervalo entre horários é controlado pela regra de negócio do módulo de agendamentos.

## Estado do projeto

Implementado:

- Arquitetura modular e conexão com MySQL.
- Autenticação JWT com refresh token.
- CRUD de agendamentos e autorização administrativa.
- Recuperação e redefinição de senha com envio de e-mail.

Próximos passos:

- Adicionar testes automatizados e migrations.
- Reforçar validações, rate limiting, logs e headers de segurança.
- Padronizar erros e respostas da API.
- Finalizar a integração com IA e preparar o deploy em produção.

## Licença

ISC.
