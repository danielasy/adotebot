# functions

Funções lambda para buscar, salvar e retweetar mensagens divulgando a adoção de bichinhos.

## Requisitos

- Node.js 6.10.3 - versão suportada pelo AWS Lambda
- [Serverless](https://github.com/serverless/serverless)

## Setup

Este projeto suporta [nvm](https://github.com/creationix/nvm), Node Version Manager. Para usar a versão do Node.js recomendada ou verificar que você a possui instalada, use o comando a seguir:

```
nvm use
```

### Node.js

### Serverless
O projeto é desenvolvido usando o framework Serverless. Para instalá-lo, use:

```
npm install -g serverless
```

Crie um perfil chamado `serverless` para armazenar as credenciais da AWS a serem usadas no deploy.

```
serverless config credentials --provider aws --key <key> --secret <secret> --profile serverless
```

Para mais detalhes, siga as [instruções na documentação do framework](https://serverless.com/framework/docs/providers/aws/guide/quick-start/).

### Credenciais
Crie um arquivo `env.yml` (exemplo em `env.sample.yml`) com suas credenciais do [Twitter Apps](https://apps.twitter.com/).

### Dependências do projeto

Use o comando abaixo:

```
yarn install
```

## Deploy

```
serverless deploy
```

É possível sobrescrever `stage` e `region` pela linha de comando:

```
serverless deploy --stage prod --region us-east-1
```

Também é possível pular as etapas de configuração da AWS CloudFormation Stack e simplesmente atualizar a versão de uma função:

```
serverless deploy function --function <myFunction>
```
