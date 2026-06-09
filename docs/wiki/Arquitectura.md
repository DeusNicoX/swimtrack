# Arquitectura de SwimTrack

## Tipo de arquitectura

SwimTrack utiliza una arquitectura cliente-servidor basada en API REST.

```text
React + Vite Frontend
        |
        | HTTP JSON
        v
Node.js + Express API
        |
        | pg
        v
PostgreSQL
```

## Componentes principales

### Frontend

- React + Vite.
- React Router para navegación.
- Consumo de API mediante `VITE_API_BASE_URL`.
- Gestión básica de sesión con `localStorage`.
- Interfaces principales: login, registro, listado de servicios y publicación de servicios.

### Backend

- Node.js + Express.
- API REST.
- Autenticación con JWT.
- Cifrado de contraseñas con bcrypt.
- CORS configurable mediante `CORS_ORIGIN`.
- Swagger disponible en `/api/docs`.

### Base de datos

- PostgreSQL.
- En local se ejecuta con Docker Compose.
- En producción se usa Neon PostgreSQL.
- Tablas principales:
  - `users`
  - `trainer_profiles`
  - `services`

## Servicios externos

- GitHub para repositorio y control de versiones.
- GitHub Actions para CI.
- Vercel para frontend en producción.
- Render para backend en producción.
- Neon para base de datos PostgreSQL en producción.

## Decisiones técnicas

- React fue seleccionado por su facilidad para crear interfaces reutilizables.
- Express fue seleccionado por su simplicidad para crear APIs REST.
- PostgreSQL fue seleccionado por su modelo relacional y compatibilidad con entidades como usuarios, perfiles y servicios.
- JWT fue seleccionado para proteger rutas y controlar acceso por rol.
- Docker fue usado para reproducir el entorno local.
- GitHub Actions fue usado para automatizar lint, build y pruebas.