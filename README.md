# Agro Gestor - Documentação

Este projeto implementa uma API RESTful para gerenciamento de produtores rurais e suas plantações, utilizando NestJS, Prisma ORM e PostgreSQL, seguindo os princípios SOLID e Clean Code.

- Disponível em http://ec2-18-231-183-197.sa-east-1.compute.amazonaws.com
- Documentação Swagger: http://ec2-18-231-183-197.sa-east-1.compute.amazonaws.com/api

## Projeto

### Diagrama lógico
<img src="./docs/img/logic_diagram.png" alt="Descrição da imagem" width="600" height="550">


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

### Representação da arquitetura de implantação

![Arq Implantação](./docs//img//ec2_deploy.png)

- Cliente (Browser): O navegador representa o cliente e inicia uma requisição HTTP (HTTP request) para acessar a aplicação.

- Amazon EC2: Essa requisição é direcionada para uma instância do Amazon EC2, que hospeda os componentes da aplicação.

- NGINX: Dentro da instância EC2, o NGINX atua como proxy reverso, recebendo as requisições do cliente e gerenciando o tráfego de entrada.

- Aplicação Node.js (gerenciada por PM2): O NGINX encaminha as requisições para a aplicação Node.js, que está em execução localmente na porta 3000.
Essa aplicação é gerenciada pelo PM2, um gerenciador de processos que mantém o serviço ativo e otimizado, garantindo maior disponibilidade e resiliência.


### Alguns do Princípios SOLID Aplicados

- **S (Single Responsibility Principle):** Cada componente (controlador, serviço, repositório, DTO) possui uma única responsabilidade bem definida. Por exemplo, os Controllers lidam apenas com requisições HTTP, os Services contêm a lógica de negócio e os Repositories gerenciam a persistência de dados.
- **O (Open/Closed Principle):** O uso de interfaces para os repositórios (IProducersRepository, IFarmsRepository, etc.) permite que novas implementações de persistência sejam adicionadas sem modificar o código existente dos serviços, que dependem apenas da abstração.
- **I (Interface Segregation Principle):** As interfaces dos repositórios são específicas para cada entidade, evitando que classes sejam forçadas a implementar métodos que não utilizam. Cada interface define apenas as operações relevantes para sua respectiva entidade.


### Principais pincípios de Domain-Driven Design (DDD) Utilizados
- Entidades: Modelagem de conceitos de negócio com identidade única (ex: Produtor, Fazenda).
- Repositórios: Abstração da camada de persistência de dados.
- Serviços: Encapsulamento da lógica de negócio e orquestração de operações.

------
------

### :rocket: Principais Tecnologias Utilizadas
- [Node.js](https://nodejs.org/en/)
- [Nest.js](https://nestjs.com/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/)
  
## Como executar o projeto localmente
Para executar que o projeto seja executado localmente, são necessárias algumas configurações:
- [node.js](https://nodejs.org/en/)
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

### Testes Unitários
1. Execute o comando:
```
yarn test
```

### Testes de integração (End-to-End)
1. Inicie o container de serviço do banco de dados - **teste**:

```
docker compose -f docker-compose.test.yml up -d 
```

2. Faça as migrações do Prisma:
```
npx dotenv -e .env.test -- prisma migrate deploy 
```

3. Execute o comando de teste:
```
yarn test:e2e
```

4. Depois dos testes, pare os serviços docker:
```
docker compose down
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

----

## Evoluções
- Criar Pipeline CI/CD
- Teste de carga
