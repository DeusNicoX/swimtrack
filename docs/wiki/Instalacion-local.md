# Instalación local

## Requisitos

- Node.js 20 o superior, recomendado Node.js 22.
- npm.
- Docker Desktop.
- Git.

## Clonar repositorio

```bash
git clone https://github.com/DeusNicoX/swimtrack.git
cd swimtrack
```

## Instalar dependencias

```bash
npm install
```

## Configurar variables de entorno

Backend:

```bash
cp backend/.env.example backend/.env
```

Variables principales:

```env
PORT=3000
DATABASE_URL=postgres://swimtrack:swimtrack@localhost:5433/swimtrack
JWT_SECRET=change_me_in_local_env
JWT_EXPIRES_IN=1h
CORS_ORIGIN=http://localhost:5173,http://127.0.0.1:5173,http://localhost:8080
NODE_ENV=development
```

Frontend:

```env
VITE_API_BASE_URL=http://localhost:3000
```

## Levantar PostgreSQL local

```bash
docker compose up -d swimtrack-postgres
```

## Aplicar schema

```bash
npm run db:schema --workspace backend
```

## Ejecutar backend

```bash
npm run dev:backend
```

Backend local:

```text
http://localhost:3000
```

## Ejecutar frontend

```bash
npm run dev:frontend
```

Frontend local:

```text
http://localhost:5173
```

## Ejecutar todo con Docker

```bash
docker compose up -d --build
```

Servicios:

- Frontend: http://localhost:8080
- Backend: http://localhost:3000
- Swagger: http://localhost:3000/api/docs/
- PostgreSQL: localhost:5433

## Detener servicios

```bash
docker compose down
```