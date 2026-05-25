# SwimTrack

SwimTrack es un prototipo academico de plataforma web para conectar entrenadores de natacion con usuarios interesados en servicios de entrenamiento.

## Estructura inicial

- `frontend/`: aplicacion React creada para ejecutarse con Vite.
- `backend/`: API base con Node.js y Express.
- `docs/`: documentacion del proyecto.

## Instalar dependencias

Desde la raiz del proyecto:

```bash
npm install
```

Tambien puedes instalar por separado:

```bash
cd frontend
npm install
```

```bash
cd backend
npm install
```

## Levantar en local

### Base de datos local

Este proyecto usa un contenedor PostgreSQL independiente llamado `swimtrack-postgres`.
Se expone en el puerto local `5433` para evitar conflictos con otros proyectos.

Levantar la base de datos:

```bash
docker compose up -d swimtrack-postgres
```

Configurar variables del backend:

```bash
cp backend/.env.example backend/.env
```

La conexion local esperada es:

```env
DATABASE_URL=postgres://swimtrack:swimtrack@localhost:5433/swimtrack
```

Ejecutar el schema:

```bash
npm run db:schema --workspace backend
```

Frontend:

```bash
npm run dev:frontend
```

Backend:

```bash
npm run dev:backend
```

Por defecto, el frontend usa Vite en `http://localhost:5173` y el backend usa Express en `http://localhost:3000`.

Validar conexion del backend con la base:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Usuario Prueba","email":"usuario@test.com","password":"123456","role":"client"}'
```

Si la conexion esta correcta, la API responde con un usuario, un `token` JWT y el mensaje `Usuario registrado correctamente`.

## Scripts utiles

```bash
npm run lint
npm run format
```
## Documentacion academica - Actividad 4

La documentacion relacionada con el ejercicio de versionamiento colaborativo
puede consultarse en los siguientes archivos:

- [Historias de usuario](docs/historias-de-usuario.md)
- [Flujo colaborativo con Git y GitHub](docs/flujo-colaborativo-git.md)

**Integrantes:**
- Josberth Anibal Patiño
- Nicolas Saenz Bello
