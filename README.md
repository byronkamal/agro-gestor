# API de Produtores Rurais - Documentação

Este projeto implementa uma API RESTful para gerenciamento de produtores rurais, utilizando NestJS, Prisma ORM e PostgreSQL, seguindo os princípios SOLID e Clean Code.

## Estrutura do Projeto

O projeto segue uma organização por funcionalidade:

```
src/
├── producers/               # Tudo relacionado a produtores
│   ├── entities/            # Entidades de produtor
│   ├── dtos/                # DTOs de produtor
│   ├── repositories/        # Repositórios de produtor
│   ├── services/            # Serviços de produtor
│   ├── controllers/         # Controllers de produtor
│   └── producers.module.ts  # Módulo de produtores
│
├── common/                  # Código comum/compartilhado
│   ├── value-objects/       # Value objects compartilhados
│   ├── exceptions/          # Exceções personalizadas
│   └── validators/          # Validadores compartilhados
│
└── main.ts                  # Ponto de entrada da aplicação
```

## Requisitos

- Node.js (v16 ou superior)
- PostgreSQL
- NPM

## Configuração

1. Clone o repositório
2. Instale as dependências:
   ```
   npm install
   ```
3. Configure o arquivo `.env` com a URL de conexão do PostgreSQL:
   ```
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/rural_producers"
   ```
4. Execute as migrações do Prisma:
   ```
   npx prisma migrate dev --name init
   ```
5. Inicie o servidor:
   ```
   npm run start:dev
   ```

## Endpoints da API

A API estará disponível em `http://localhost:3000` com os seguintes endpoints:

### Produtores Rurais

- **GET /producers** - Lista todos os produtores
- **GET /producers/:id** - Busca um produtor pelo ID
- **POST /producers** - Cria um novo produtor
- **PUT /producers/:id** - Atualiza um produtor existente
- **DELETE /producers/:id** - Remove um produtor

## Documentação Swagger

A documentação completa da API está disponível através do Swagger UI em:

```
http://localhost:3000/api
```

## Validações Implementadas

- Validação de CPF/CNPJ
- Campos obrigatórios
- Tratamento de erros

## Exemplo de Uso

### Criar um Produtor

```bash
curl -X POST http://localhost:3000/producers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João da Silva",
    "document": "123.456.789-00"
  }'
```

### Listar Produtores

```bash
curl -X GET http://localhost:3000/producers
```

## Princípios SOLID Aplicados

1. **Single Responsibility Principle**: Cada classe tem uma única responsabilidade
2. **Open/Closed Principle**: Extensão sem modificação através de interfaces
3. **Liskov Substitution Principle**: Implementações de repositório são substituíveis
4. **Interface Segregation Principle**: Interfaces específicas para cada necessidade
5. **Dependency Inversion Principle**: Dependências em abstrações, não implementações
