# API de SwimTrack

La API REST de SwimTrack está desarrollada con Node.js y Express.

## Swagger

Documentación local:

```text
http://localhost:3000/api/docs/
```

Documentación en producción:

```text
https://swimtrack-kax1.onrender.com/api/docs/
```

## Health check

```http
GET /api/health
```

URL producción:

```text
https://swimtrack-kax1.onrender.com/api/health
```

Respuesta esperada:

```json
{
  "status": "ok",
  "timestamp": "2026-06-07T00:00:00.000Z",
  "environment": "production"
}
```

## Endpoints principales

| Método | Ruta | Descripción | Autenticación |
|---|---|---|---|
| POST | `/api/auth/register` | Registro de usuario cliente o entrenador | No |
| POST | `/api/auth/login` | Inicio de sesión y generación de JWT | No |
| GET | `/api/services` | Lista pública de servicios | No |
| POST | `/api/services` | Publicación de servicio por entrenador | Bearer JWT |

## Seguridad

El endpoint `POST /api/services` requiere token JWT en el encabezado:

```http
Authorization: Bearer <token>
```

## Esquemas documentados

- `User`
- `AuthResponse`
- `Service`
- `CreateServiceRequest`
- `ErrorResponse`

## Validación en producción

```bash
curl https://swimtrack-kax1.onrender.com/api/health
```

También se puede validar la documentación interactiva desde Swagger UI.