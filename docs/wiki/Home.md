# SwimTrack Wiki

SwimTrack es una plataforma web académica para conectar entrenadores de natación con usuarios interesados en servicios de entrenamiento.

## Enlaces principales

- Repositorio: https://github.com/DeusNicoX/swimtrack
- Frontend en producción: https://swimtrack-frontend.vercel.app/
- Backend en producción: https://swimtrack-kax1.onrender.com
- Swagger/OpenAPI: https://swimtrack-kax1.onrender.com/api/docs/
- Health check: https://swimtrack-kax1.onrender.com/api/health

## Navegación de la documentación

- [Arquitectura](Arquitectura.md)
- [Instalación local](Instalacion-local.md)
- [API](API.md)
- [Pruebas](Pruebas.md)
- [CI/CD](CI-CD.md)
- [Despliegue](Despliegue.md)
- [Retrospectiva](Retrospectiva.md)

## Funcionalidades implementadas

- Registro de usuarios con roles `client` y `trainer`.
- Inicio de sesión con JWT.
- Persistencia de sesión en el frontend.
- Redirección por rol.
- Publicación de servicios por entrenadores.
- Listado de servicios desde PostgreSQL.
- Búsqueda y filtros de servicios.
- Documentación Swagger.
- Pruebas unitarias, integración y End-to-End.
- Despliegue del frontend en Vercel.
- Despliegue del backend en Render.
- Base de datos PostgreSQL en Neon.

## Nota

Esta carpeta contiene documentación tipo Wiki dentro del repositorio. Para activar la Wiki real de GitHub, copiar estos archivos en la pestaña Wiki del repositorio.