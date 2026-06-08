# SwimTrack

SwimTrack es una plataforma web academica para conectar entrenadores de
natacion con usuarios interesados en servicios de entrenamiento. El proyecto
incluye frontend React, API REST Node.js/Express, persistencia en PostgreSQL,
autenticacion JWT, pruebas automatizadas y documentacion OpenAPI.

## Problema que resuelve

Los usuarios que buscan entrenamiento de natacion suelen depender de contactos
informales para encontrar entrenadores, horarios y modalidades disponibles.
SwimTrack centraliza la publicacion y busqueda de servicios para que:

- Los clientes encuentren servicios de entrenamiento disponibles.
- Los entrenadores publiquen sus servicios con modalidad, ubicacion y horario.
- La plataforma controle el acceso a funcionalidades segun el rol del usuario.

## Funcionalidades implementadas

- Registro de usuarios con rol `client` o `trainer`.
- Inicio de sesion con JWT.
- Persistencia de sesion en el frontend.
- Redireccion por rol: clientes a listado de servicios y entrenadores a
  publicacion.
- Listado publico de servicios reales desde PostgreSQL.
- Publicacion de servicios protegida para usuarios `trainer`.
- Busqueda y filtros en el listado de servicios.
- Pruebas unitarias, integracion y End-to-End.
- Coverage configurado con Vitest.
- Documentacion Swagger/OpenAPI en `/api/docs`.

## Arquitectura general

```text
React + Vite frontend
        |
        | HTTP JSON
        v
Node.js + Express API
        |
        | pg
        v
PostgreSQL local en Docker
```

El frontend consume la API REST mediante `VITE_API_BASE_URL`. El backend
valida credenciales, firma tokens JWT y usa PostgreSQL para usuarios, perfiles
de entrenadores y servicios.

## Tecnologias utilizadas

- React 19
- Vite
- React Router
- Node.js
- Express
- PostgreSQL
- Docker Compose
- JWT con `jsonwebtoken`
- Password hashing con `bcrypt`
- Vitest
- React Testing Library
- Supertest
- Playwright
- ESLint
- Swagger UI / OpenAPI

## Estructura de carpetas

```text
.
├── backend/
│   ├── db/schema.sql
│   ├── src/app.js
│   ├── src/server.js
│   ├── src/config/
│   ├── src/controllers/
│   ├── src/middleware/
│   ├── src/routes/
│   └── test/
├── frontend/
│   ├── src/pages/
│   ├── src/utils/
│   ├── src/styles/
│   └── src/test/
├── tests/e2e/
├── docs/
├── compose.yml
├── playwright.config.js
└── package.json
```

## Variables de entorno

El backend lee variables desde `backend/.env`.

Archivo base:

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

El frontend lee variables desde `frontend/.env`. Archivo base:

```bash
cp frontend/.env.example frontend/.env
```

Variable principal:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Si no se define, usa `http://localhost:3000`.

## Instalacion local

Desde la raiz:

```bash
npm install
```

Tambien se puede instalar por workspace:

```bash
npm install --workspace backend
npm install --workspace frontend
```

## Base de datos con Docker

El `compose.yml` incluye PostgreSQL, backend y frontend. PostgreSQL conserva el
puerto local `5433` para evitar conflictos con instalaciones locales.

```bash
docker compose up -d swimtrack-postgres
```

Verificar estado:

```bash
docker compose ps
```

## Ejecutar schema

Con PostgreSQL levantado y `backend/.env` configurado:

```bash
npm run db:schema --workspace backend
```

El schema crea:

- `users`
- `trainer_profiles`
- `services`

## Levantar backend

```bash
npm run dev:backend
```

API local:

```text
http://localhost:3000
```

## Levantar frontend

```bash
npm run dev:frontend
```

Frontend local:

```text
http://localhost:5173
```

## Ejecucion completa con Docker

Construir y levantar PostgreSQL, backend y frontend:

```bash
docker compose up -d
```

Ver logs:

```bash
docker compose logs -f
```

Detener contenedores:

```bash
docker compose down
```

Servicios locales:

| Servicio | URL / puerto |
|---|---|
| Frontend | `http://localhost:8080` |
| Backend | `http://localhost:3000` |
| Swagger | `http://localhost:3000/api/docs/` |
| PostgreSQL | `localhost:5433` |

El backend del compose usa internamente:

```env
DATABASE_URL=postgres://swimtrack:swimtrack@swimtrack-postgres:5432/swimtrack
CORS_ORIGIN=http://localhost:8080
```

El frontend Docker se compila con:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Como Vite inyecta esta variable en tiempo de build, si necesitas otro backend
debes reconstruir la imagen del frontend con otro `VITE_API_BASE_URL`.

### Ejecutar schema con Docker

Con los contenedores levantados:

```bash
docker compose exec swimtrack-backend npm run db:schema --workspace backend
```

Tambien puedes ejecutarlo fuera del contenedor contra PostgreSQL publicado en
`localhost:5433`:

```bash
npm run db:schema --workspace backend
```

## Scripts disponibles

```bash
npm run build
npm run lint
npm run test
npm run test:unit
npm run test:coverage
npm run test:integration
npm run test:e2e
npm run test:e2e:docker
npm run test:e2e:headed
npm run format
```

### Lint

```bash
npm run lint --workspaces
```

### Build

```bash
npm run build
npm run build --workspace frontend
```

### Pruebas unitarias

```bash
npm run test
npm run test:unit
```

### Coverage

```bash
npm run test:coverage
```

### Pruebas de integracion

Las pruebas de integracion del backend usan Supertest contra la app Express
real y PostgreSQL local. Primero levanta la base:

```bash
docker compose up -d swimtrack-postgres
npm run test:integration
```

Estas pruebas aplican el schema antes de correr, usan correos unicos por
ejecucion y eliminan los usuarios creados al finalizar.

### Pruebas End-to-End

Modo desarrollo, con servidores levantados automaticamente por Playwright:

```bash
npm run test:e2e
```

Este comando detiene `swimtrack-backend` y `swimtrack-frontend` si quedaron
activos por Docker, mantiene PostgreSQL disponible y luego inicia backend y
frontend de desarrollo. Asi puede ejecutarse despues de `test:e2e:docker` sin
reutilizar accidentalmente el backend Docker.

Modo con navegador visible:

```bash
npm run test:e2e:headed
```

Por defecto Playwright usa:

```env
PLAYWRIGHT_BASE_URL=http://127.0.0.1:5173
PLAYWRIGHT_API_URL=http://localhost:3000
```

Playwright levanta PostgreSQL con Docker Compose, aplica el schema, inicia
backend y frontend en esos puertos, usa datos unicos por ejecucion y limpia los
usuarios con prefijo `e2e-` al finalizar.

Modo contra Docker, autosuficiente:

```bash
npm run test:e2e:docker
```

Este comando ejecuta `docker compose up -d --build`, espera a que respondan
`http://localhost:3000/` y `http://localhost:8080/`, aplica el schema dentro de
`swimtrack-backend` y luego corre Playwright contra el frontend Docker.

Este modo usa:

```env
PLAYWRIGHT_BASE_URL=http://localhost:8080
PLAYWRIGHT_API_URL=http://localhost:3000
PLAYWRIGHT_SKIP_WEB_SERVER=1
```

Ambos modos pueden ejecutarse consecutivamente. El backend Docker acepta los
origenes locales `http://localhost:8080`, `http://localhost:5173` y
`http://127.0.0.1:5173` mediante `CORS_ORIGIN` separado por comas.

Tambien puedes apuntar las pruebas a otros puertos:

```bash
PLAYWRIGHT_BASE_URL=http://localhost:8080 \
PLAYWRIGHT_API_URL=http://localhost:3000 \
PLAYWRIGHT_SKIP_WEB_SERVER=1 \
npm run test:e2e
```

## Documentacion de API

Swagger UI esta disponible con el backend levantado:

```text
http://localhost:3000/api/docs
```

Endpoints documentados:

| Metodo | Ruta | Descripcion | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Registro de usuario client o trainer | No |
| POST | `/api/auth/login` | Inicio de sesion y generacion de JWT | No |
| GET | `/api/services` | Listado publico de servicios | No |
| POST | `/api/services` | Publicacion de servicio por entrenador | Bearer JWT |

Schemas OpenAPI incluidos:

- `User`
- `AuthResponse`
- `Service`
- `CreateServiceRequest`
- `ErrorResponse`

## Docker actual

Docker Compose levanta el sistema completo local:

```bash
docker compose up -d
```

Incluye:

- `swimtrack-postgres`: PostgreSQL 16 en `5433:5432`.
- `swimtrack-backend`: API Express en `3000:3000`.
- `swimtrack-frontend`: build Vite servido por nginx en `8080:80`.

Pendiente para produccion:

- Separar secretos reales en un gestor de variables.
- Ajustar CORS al dominio final.
- Definir estrategia de migraciones versionadas.

## CI/CD

El repositorio incluye un workflow de GitHub Actions en
`.github/workflows/ci.yml`.

Eventos configurados:

- `pull_request` hacia `main`.
- `push` hacia `main`.

El job `ci` usa Ubuntu, Node.js 22 y Docker Compose. Ejecuta:

```bash
npm ci
npx playwright install chromium
npm run lint --workspaces
npm run build
npm run test
npm run test:coverage
docker compose up -d swimtrack-postgres
npm run db:schema --workspace backend
npm run test:integration
npm run test:e2e:docker
```

`npm run test` y `npm run test:coverage` ejecutan pruebas unitarias. Las
pruebas de integracion se ejecutan despues de levantar PostgreSQL y aplicar el
schema.

El script `test:e2e:docker` construye y levanta el stack Docker completo antes
de ejecutar Playwright contra `http://localhost:8080`.

Evidencias esperadas en GitHub Actions:

- Check `CI / Lint, build and test` en verde para cada Pull Request.
- Logs de instalacion, lint, build, pruebas unitarias, integracion, coverage y
  E2E Docker.
- Artefactos `playwright-report` y `playwright-test-results` cuando fallen las
  pruebas E2E.

No hay despliegue configurado en este workflow.

## Despliegue

SwimTrack esta preparado para desplegar:

- Frontend en Vercel.
- Backend en Render.
- PostgreSQL en Neon.

No se deben commitear secretos reales. Configura las credenciales solo en los
paneles de cada plataforma.

### 1. Base de datos en Neon PostgreSQL

1. Crea un proyecto en Neon.
2. Crea una base de datos para SwimTrack.
3. Copia la connection string de Neon.
4. En local o desde un entorno seguro, aplica el schema apuntando a Neon:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST.neon.tech/DB?sslmode=require" \
npm run db:schema --workspace backend
```

No pegues la URL real en archivos del repositorio.

### 2. Backend en Render

Crear un Web Service en Render conectado al repositorio de GitHub.

Configuracion recomendada:

| Campo | Valor |
|---|---|
| Runtime | Node |
| Root Directory | raiz del repo |
| Build Command | `npm ci --omit=dev --workspace backend` |
| Start Command | `npm run start --workspace backend` |

Variables de entorno en Render:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://USER:PASSWORD@HOST.neon.tech/DB?sslmode=require
JWT_SECRET=generate_a_secure_random_secret
JWT_EXPIRES_IN=1h
CORS_ORIGIN=https://your-vercel-app.vercel.app
```

Validaciones post-deploy del backend:

```text
https://your-render-service.onrender.com/api/health
https://your-render-service.onrender.com/api/docs/
https://your-render-service.onrender.com/api/services
```

`/api/health` debe responder:

```json
{
  "status": "ok",
  "timestamp": "2026-06-07T00:00:00.000Z",
  "environment": "production"
}
```

### 3. Frontend en Vercel

Crear un proyecto en Vercel conectado al mismo repositorio.

Configuracion recomendada:

| Campo | Valor |
|---|---|
| Framework Preset | Vite |
| Root Directory | raiz del repo |
| Install Command | `npm ci` |
| Build Command | `npm run build --workspace frontend` |
| Output Directory | `frontend/dist` |

Variable de entorno en Vercel:

```env
VITE_API_BASE_URL=https://your-render-service.onrender.com
```

Despues de configurar el dominio final de Vercel, actualiza en Render:

```env
CORS_ORIGIN=https://your-vercel-app.vercel.app
```

Si necesitas permitir varios origenes temporales:

```env
CORS_ORIGIN=https://your-vercel-app.vercel.app,https://your-preview.vercel.app
```

Validaciones post-deploy del frontend:

- Abrir `https://your-vercel-app.vercel.app`.
- Registrar un usuario `client` y confirmar redireccion a `/servicios`.
- Registrar o iniciar sesion como `trainer` y publicar un servicio.
- Confirmar que el servicio aparece en el listado.

### Variables finales de produccion

Backend Render:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=1h
CORS_ORIGIN=
```

Frontend Vercel:

```env
VITE_API_BASE_URL=
```

## Documentacion academica

- [Arquitectura](docs/architecture.md)
- [Historias de usuario](docs/historias-de-usuario.md)
- [Flujo colaborativo con Git y GitHub](docs/flujo-colaborativo-git.md)

## Autores

- Josberth Anibal Patiño
- Nicolas Saenz Bello
