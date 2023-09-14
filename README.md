## Variaveis de ambiente

```bash
# comece copiando o exemplo para seu .env
cp .env.example .env
```

## Instalação

```bash
$ docker-compose run api yarn

# adicionar a dependencia
$ docker-compose run api yarn add bcrypt
```

## Iniciar app

### Com docker

```bash
# rodar database e api
$ docker-compose up
```

### Without docker

> Deve ser configurado o db manualmente aqui

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Prisma

```bash
$ npx prisma generate

$ npx prisma migrate dev

# Popular seu banco de dados com dados mocados inicialmente
$ npx prisma db seed
```
