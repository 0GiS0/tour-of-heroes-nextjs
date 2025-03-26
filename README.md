¡Hola developer 👋🏻! Este es un repo que he creado para aprender Next.js con mi aplicación de ejemplo de Tour of Heroes 

Puedes ejecutarlo dentro de un Dev Containers

o en local con una base de datos PostgresSQL

```pwsh
docker run -d --name heroes-postgresql `
-p 5432:5432 `
-e POSTGRES_PASSWORD=postgres `
-e POSTGRES_USER=postgres `
-e POSTGRES_DB=heroesdb `
postgres:latest
```


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm i
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
