# Retrospectiva final

## Principales aprendizajes

- Integración de frontend, backend y base de datos en un MVP funcional.
- Uso de React, Express y PostgreSQL bajo una arquitectura cliente-servidor.
- Implementación de autenticación con JWT y control de roles.
- Configuración de pruebas unitarias, integración y End-to-End.
- Uso de Docker para reproducir el entorno local.
- Configuración de CI con GitHub Actions.
- Despliegue del frontend en Vercel, backend en Render y base de datos en Neon.

## Dificultades enfrentadas

- Separar correctamente pruebas unitarias e integración en CI.
- Esperar disponibilidad real de PostgreSQL antes de aplicar schema.
- Configurar rutas SPA en Vercel para evitar errores 404 en `/login` y `/registro`.
- Ajustar CORS de producción entre Vercel y Render.
- Mantener coherencia entre los prototipos diseñados y el MVP funcional.

## Qué se cambiaría si se iniciara nuevamente

- Definir desde el inicio una estructura de pruebas automatizadas.
- Configurar producción y variables de entorno desde fases tempranas.
- Crear migraciones versionadas en lugar de un único `schema.sql`.
- Documentar decisiones técnicas desde el primer sprint.

## Recomendaciones para futuros equipos

- Validar localmente cada flujo antes de desplegar.
- Separar claramente pruebas unitarias, integración y E2E.
- Mantener variables sensibles fuera del repositorio.
- Documentar errores y soluciones durante el proceso.
- Tomar evidencias desde el inicio para facilitar el documento final.

## Métricas finales sugeridas

- Historias implementadas: registro, login, sesión, publicación de servicios, listado de servicios, búsqueda/filtros.
- Pruebas unitarias: frontend y backend.
- Pruebas de integración: 5.
- Pruebas E2E: 4.
- Coverage: superior al 85% requerido.
- CI: workflow en verde.
- Producción: frontend, backend y base de datos desplegados.