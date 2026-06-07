import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import swaggerJsdoc from 'swagger-jsdoc';

const currentDir = dirname(fileURLToPath(import.meta.url));

/**
 * OpenAPI document generated from the local Swagger annotations.
 * It documents the current REST surface used by the React frontend.
 */
export const swaggerSpec = swaggerJsdoc({
  apis: [resolve(currentDir, '../routes/*.js')],
  definition: {
    components: {
      securitySchemes: {
        bearerAuth: {
          bearerFormat: 'JWT',
          scheme: 'bearer',
          type: 'http',
        },
      },
      schemas: {
        AuthResponse: {
          properties: {
            message: {
              example: 'Login correcto',
              type: 'string',
            },
            token: {
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
              type: 'string',
            },
            user: {
              $ref: '#/components/schemas/User',
            },
          },
          type: 'object',
        },
        CreateServiceRequest: {
          properties: {
            description: {
              example: 'Entrenamiento personalizado de tecnica libre.',
              type: 'string',
            },
            location: {
              example: 'Piscina Olimpica',
              type: 'string',
            },
            modality: {
              example: 'Individual',
              type: 'string',
            },
            schedule: {
              example: 'Lunes y miercoles, 6:00 p.m.',
              type: 'string',
            },
            title: {
              example: 'Natacion tecnica individual',
              type: 'string',
            },
          },
          required: ['title', 'description', 'modality', 'location', 'schedule'],
          type: 'object',
        },
        ErrorResponse: {
          properties: {
            message: {
              example: 'Credenciales invalidas',
              type: 'string',
            },
          },
          type: 'object',
        },
        Service: {
          properties: {
            coach: {
              properties: {
                email: {
                  example: 'coach@test.com',
                  type: 'string',
                },
                full_name: {
                  example: 'Laura Gomez',
                  type: 'string',
                },
                id: {
                  example: 2,
                  type: 'integer',
                },
              },
              type: 'object',
            },
            created_at: {
              example: '2026-06-07T12:00:00.000Z',
              format: 'date-time',
              type: 'string',
            },
            description: {
              example: 'Entrenamiento personalizado de tecnica libre.',
              type: 'string',
            },
            id: {
              example: 1,
              type: 'integer',
            },
            location: {
              example: 'Piscina Olimpica',
              type: 'string',
            },
            modality: {
              example: 'Individual',
              type: 'string',
            },
            schedule: {
              example: 'Lunes y miercoles, 6:00 p.m.',
              type: 'string',
            },
            title: {
              example: 'Natacion tecnica individual',
              type: 'string',
            },
          },
          type: 'object',
        },
        User: {
          properties: {
            email: {
              example: 'usuario@test.com',
              format: 'email',
              type: 'string',
            },
            full_name: {
              example: 'Usuario Prueba',
              type: 'string',
            },
            id: {
              example: 1,
              type: 'integer',
            },
            role: {
              enum: ['client', 'trainer'],
              example: 'client',
              type: 'string',
            },
          },
          type: 'object',
        },
      },
    },
    info: {
      description:
        'API REST de SwimTrack para autenticacion y publicacion/listado de servicios de entrenamiento de natacion.',
      title: 'SwimTrack API',
      version: '1.0.0',
    },
    openapi: '3.0.3',
    servers: [
      {
        description: 'Servidor local de desarrollo',
        url: 'http://localhost:3000',
      },
    ],
    tags: [
      {
        description: 'Registro e inicio de sesion con JWT',
        name: 'Auth',
      },
      {
        description: 'Servicios publicados por entrenadores',
        name: 'Services',
      },
    ],
  },
});
