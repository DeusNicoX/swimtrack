# Despliegue

SwimTrack fue desplegado usando servicios gratuitos o de bajo costo para fines académicos.

## Frontend

Plataforma: Vercel.

URL:

```text
https://swimtrack-frontend.vercel.app/
```

Configuración principal:

```env
VITE_API_BASE_URL=https://swimtrack-kax1.onrender.com
```

## Backend

Plataforma: Render.

URL:

```text
https://swimtrack-kax1.onrender.com
```

Swagger:

```text
https://swimtrack-kax1.onrender.com/api/docs/
```

Health check:

```text
https://swimtrack-kax1.onrender.com/api/health
```

Variables principales:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=<NEON_DATABASE_URL>
JWT_SECRET=<SECRET>
JWT_EXPIRES_IN=1h
CORS_ORIGIN=https://swimtrack-frontend.vercel.app
```

## Base de datos

Plataforma: Neon PostgreSQL.

Tablas principales:

- `users`
- `trainer_profiles`
- `services`

El schema se aplica con:

```bash
DATABASE_URL="<NEON_DATABASE_URL>" npm run db:schema --workspace backend
```

## Validaciones de producción

- Abrir frontend en Vercel.
- Registrar usuario cliente.
- Registrar usuario entrenador.
- Publicar servicio.
- Listar servicio publicado.
- Probar búsqueda.
- Abrir Swagger en producción.
- Probar health check.

## Consideraciones

- Render Free puede dormir la instancia cuando no recibe tráfico, por lo que la primera petición puede tardar.
- Vercel requiere `vercel.json` para soportar rutas SPA como `/login` y `/registro`.
- CORS debe coincidir exactamente con el dominio de Vercel, sin slash final.