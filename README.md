# Agro Gestor - Documentação

Este projeto implementa uma API RESTful para gerenciamento de produtores rurais, utilizando NestJS, Prisma ORM e PostgreSQL, seguindo os princípios SOLID e Clean Code.

## Estrutura do Projeto

### Diagrama Lógico
![logic_diagram](./img/logic_diagram.png)


### Estrutura de pastas
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
├── farms/               # Tudo relacionado a fazendas (propriedade rural)
│   ├── entities/            # Entidades de fazenda
│   ├── dtos/                # DTOs de fazenda
│   ├── repositories/        # Repositórios de fazenda
│   ├── services/            # Serviços de fazenda
│   ├── controllers/         # Controllers de fazenda
│   └── producers.module.ts  # Módulo de fazendas
|
│   [...]
│
├── common/                  # Código comum/compartilhado
│   ├── value-objects/       # Value objects compartilhados
│   ├── exceptions/          # Exceções personalizadas
│   └── validators/          # Validadores compartilhados
│
└── main.ts                  # Ponto de entrada da aplicação
```

## Alguns do Princípios SOLID Aplicados

- S (Single Responsibility Principle): Cada componente (controlador, serviço, repositório, DTO) possui uma única responsabilidade bem definida. Por exemplo, os Controllers lidam apenas com requisições HTTP, os Services contêm a lógica de negócio e os Repositories gerenciam a persistência de dados.
- O (Open/Closed Principle): O uso de interfaces para os repositórios (IProducersRepository, IFarmsRepository, etc.) permite que novas implementações de persistência sejam adicionadas sem modificar o código existente dos serviços, que dependem apenas da abstração.
- I (Interface Segregation Principle): As interfaces dos repositórios são específicas para cada entidade, evitando que classes sejam forçadas a implementar métodos que não utilizam. Cada interface define apenas as operações relevantes para sua respectiva entidade.


## Principais pincípios de Domain-Driven Design (DDD) Utilizados
- Entidades: Modelagem de conceitos de negócio com identidade única (ex: Produtor, Fazenda).
- Repositórios: Abstração da camada de persistência de dados.
- Serviços: Encapsulamento da lógica de negócio e orquestração de operações.

------

### :rocket: Principais Tecnologias Utilizadas
- [Node.js](https://nodejs.org/en/)
- [Nest.js](https://nestjs.com/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/)
  
## Como executar o projeto localmente
Para executar que o projeto seja executado localmente, são necessárias algumas configurações:
- [node.js](https://nodejs.org/en/) entre as versões ">=10.16.0 <=14.x.x"
- [yarn](https://yarnpkg.com/getting-started/install)
- [Docker](https://docs.docker.com/engine/installation/) e [Docker Compose](https://docs.docker.com/compose/install/) para execuçaão banco de dados **Postgres**

### Passo a passo
1. Clone o repositorio

2. Acesse a pasta do projeto:

```
cd api
```

3. Instale as dependências:

```
npm run build
# ou
yarn build
```

4. Configure o arquivo `.env` com a URL de conexão do PostgreSQL:
   ```
   DATABASE_NAME=agro_gestor_db
   DATABASE_USERNAME=admin
   DATABASE_PASSWORD=1234

   DATABASE_URL="postgresql://admin:1234@localhost:5432/agro_gestor_db?schema=public"
   ```
   
5. Crie e inicie o container de serviço do banco de dados:

```
docker-compose up
```
   
6. Execute as migrações do Prisma:
   ```
   npx prisma migrate dev
   ```
   
7. Inicie o servidor:
   ```
   yarn start:dev
   ```


### Documentação Swagger

A documentação completa da API está disponível através do Swagger UI em:

```
http://localhost:3000/api
```

## Validações Implementadas

- Validação de CPF/CNPJ
- Validação da área total (área agricultável + área vegetação < áre total)
- Campos obrigatórios
- Tratamento de erros
