# Sistema de Agendamento com IA

API REST para agendamento de horários, feita com Node.js, Express e MySQL. Os usuários criam conta, fazem login e marcam horários; administradores conseguem ver e remover qualquer agendamento.

O projeto está em desenvolvimento. A parte de IA que dá nome ao repositório ainda não foi implementada: hoje o código cobre autenticação e agendamento.

## O que já funciona

- Cadastro e login com senha criptografada (bcrypt).
- Access token JWT de 15 minutos e refresh token de 7 dias, com rotação a cada renovação e revogação no logout.
- Recuperação de senha: um código de 6 dígitos é enviado por e-mail, vale por 15 minutos e só pode ser usado uma vez.
- Criar, listar, editar e cancelar os próprios agendamentos.
- Consulta pública de horários livres para uma data.
- Rotas exclusivas de administrador.
- Um job que roda a cada minuto e marca como `EXPIRED` os agendamentos que já passaram.

## Regras de agendamento

- Expediente das 09:00 às 18:00.
- Intervalo mínimo de 35 minutos entre dois agendamentos, mesmo de usuários diferentes.
- Não é possível agendar nem remarcar para um horário no passado.
- Status possíveis: `PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELED` e `EXPIRED`.

Essas constantes ficam em `src/modules/agendamentos/agenda.service.js`.

## Como rodar

Você precisa de Node.js e de um MySQL 8 (os schemas usam a collation `utf8mb4_0900_ai_ci`).

```bash
git clone https://github.com/Antonyduarte/sistema-de-agendamento-com-ia.git
cd sistema-de-agendamento-com-ia
npm install
cp .env.example .env
```

Preencha o `.env`:

| Variável | Uso |
| --- | --- |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME` | Conexão com o MySQL |
| `SERVER_PORT` | Porta da API (padrão 3000) |
| `SECRET_KEY` | Chave de assinatura do JWT |
| `CORS_ROUTE` | Origem permitida pelo CORS |
| `MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, `MAIL_PASS` | SMTP para o envio dos códigos |

O transporte de e-mail usa conexão segura (`secure: true`), então o normal é usar a porta 465.

Crie as tabelas rodando os arquivos de `src/config/schema/`, começando por `clientes.sql`, já que as outras dependem dela:

```text
clientes.sql → agendamentos.sql → recovery_codes.sql → refresh_tokens.sql
```

Depois, inicie o servidor:

```bash
node src/server.js
```

Não há scripts no `package.json` por enquanto. O Express também serve uma pasta `public/` se ela existir, mas ela não faz parte do repositório.

## Estrutura

```text
src/
├── config/        # banco, e-mail e schemas SQL
├── jobs/          # expiração automática de agendamentos
├── messages/      # mensagens de erro e sucesso
├── middlewares/   # autenticação, permissão de admin e rota não encontrada
├── modules/
│   ├── agendamentos/
│   └── users/     # login, register, refresh, forgotpassword, resetPassword
├── utils/         # regex, validação do cadastro e formato de resposta
├── app.js
└── server.js
```

Cada módulo segue o fluxo route → controller → service → repository.

## Rotas

Todas as respostas seguem o formato `{ success, message, data, timestamp }`. As rotas protegidas esperam o header `Authorization: Bearer <accessToken>`.

### Autenticação (`/auth`)

| Método | Rota | Corpo |
| --- | --- | --- |
| `POST` | `/auth/register` | `nome`, `email`, `senha` (mais de 8 caracteres) |
| `POST` | `/auth/login` | `email`, `senha` |
| `POST` | `/auth/refresh` | `refreshToken` |
| `POST` | `/auth/logout` | `refreshToken` |
| `POST` | `/auth/forgot-password` | `email` |
| `PUT` | `/auth/reset-password` | `email`, `code`, `password` |

O login devolve `accessToken` e `refreshToken` em `data`.

### Agendamentos (`/agendamento`)

| Método | Rota | Acesso | Descrição |
| --- | --- | --- | --- |
| `GET` | `/disponiveis?data=AAAA-MM-DD` | Público | Horários livres do dia |
| `POST` | `/` | Logado | Cria um agendamento |
| `GET` | `/` | Logado | Lista os seus agendamentos |
| `PUT` | `/` | Logado | Altera data e hora |
| `DELETE` | `/:id` | Logado | Remove um agendamento seu |
| `GET` | `/admin` | Admin | Lista todos, com dados do cliente |
| `DELETE` | `/admin/delete/:id` | Admin | Remove qualquer agendamento |

Exemplos de corpo:

```jsonc
// POST /agendamento
{ "compromisso": "Consulta", "data": "2026-12-10", "hora": "14:30" }

// PUT /agendamento
{ "id": 12, "data": "2026-12-11", "hora": "10:00" }
```

Não existe rota para promover alguém a administrador. Para isso, altere o campo `role` da tabela `clientes` direto no banco.

## Pendências

- Integração com IA.
- Testes automatizados e migrations.
- Rate limiting, logs e headers de segurança.
- Deploy em produção.

## Licença

ISC