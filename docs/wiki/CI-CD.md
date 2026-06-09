# CI/CD

SwimTrack usa GitHub Actions para integración continua.

## Workflow CI

Archivo:

```text
.github/workflows/ci.yml
```

Eventos configurados:

- `pull_request` hacia `main`.
- `push` hacia `main`.

## Validaciones ejecutadas

El pipeline ejecuta:

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

## Evidencia actual

El workflow `CI / Lint, build and test` quedó en verde después de separar pruebas unitarias e integración y esperar correctamente PostgreSQL antes de aplicar el schema.

## Despliegue automático

El despliegue a producción se apoya en la integración nativa de GitHub con:

- Vercel para frontend.
- Render para backend.

Cada cambio enviado a `main` puede disparar nuevos despliegues según la configuración de cada proveedor.

## Evidencias recomendadas

- Captura de GitHub Actions con estado verde.
- Detalle del job con pasos de lint, build, pruebas, coverage e E2E Docker.
- Captura de despliegue exitoso en Vercel.
- Captura de despliegue exitoso en Render.