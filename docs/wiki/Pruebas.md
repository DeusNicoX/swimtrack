# Pruebas de software

SwimTrack cuenta con pruebas unitarias, pruebas de integración y pruebas End-to-End.

## Herramientas

- Vitest para pruebas unitarias y coverage.
- React Testing Library para utilidades del frontend.
- Supertest para pruebas de integración del backend.
- Playwright para pruebas End-to-End.

## Pruebas unitarias

Comando:

```bash
npm run test
```

Casos cubiertos:

- Utilidades de sesión del frontend.
- Utilidades de filtrado y normalización de servicios.
- Controladores de autenticación.
- Controladores de servicios.
- Middleware JWT.

## Coverage

Comando:

```bash
npm run test:coverage
```

Resultado validado:

- Frontend: 100%.
- Backend unitario: 100%.

El requisito académico de 85% de coverage queda superado.

## Pruebas de integración

Comando:

```bash
npm run test:integration
```

Casos cubiertos:

- Health check de la API.
- Registro exitoso de usuario cliente.
- Login exitoso.
- Entrenador autenticado crea servicio.
- Usuario cliente autenticado no puede crear servicio.

## Pruebas End-to-End

Modo desarrollo:

```bash
npm run test:e2e
```

Modo Docker:

```bash
npm run test:e2e:docker
```

Casos cubiertos:

- Registro de usuario cliente y redirección a servicios.
- Login de entrenador y acceso a publicar servicio.
- Publicación de servicio y visualización en listado.
- Búsqueda por título.

## Evidencias recomendadas

- Captura de terminal con `npm run test`.
- Captura de terminal con `npm run test:coverage`.
- Captura de terminal con `npm run test:integration`.
- Captura de terminal con `npm run test:e2e:docker`.
- Captura de GitHub Actions en verde.