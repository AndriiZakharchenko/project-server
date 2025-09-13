import swaggerJsdoc, { Options } from 'swagger-jsdoc';

const options: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your App API',
      version: '1.0.0',
      description: 'API documentation for your application',
      contact: {
        name: 'API Support',
        email: 'support@yourapp.com',
      },
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production'
          ? process.env.PRODUCTION_URL
          : process.env.LOCAL_URL,
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token',
          description: 'JWT token stored in HTTP-only cookie',
        },
      },
      schemas: {
        User: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            id: {
              type: 'string',
              description: 'Unique user identifier',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            password: {
              type: 'string',
              minLength: 6,
              description: 'User password',
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              description: 'User role',
            },
          },
        },
        Product: {
          type: 'object',
          required: ['title', 'price'],
          properties: {
            id: {
              type: 'string',
              description: 'Unique product identifier',
            },
            title: {
              type: 'string',
              description: 'Product title',
            },
            price: {
              type: 'number',
              minimum: 0,
              description: 'Product price',
            },
            description: {
              type: 'string',
              description: 'Product description',
            },
            image_url: {
              type: 'string',
              description: 'Product image URL',
            },
          },
        },
        Track: {
          type: 'object',
          required: ['title', 'artist'],
          properties: {
            id: {
              type: 'string',
              description: 'Unique track identifier',
            },
            title: {
              type: 'string',
              description: 'Track title',
            },
            artist: {
              type: 'string',
              description: 'Artist name',
            },
            duration: {
              type: 'number',
              description: 'Track duration in seconds',
            },
            track_url: {
              type: 'string',
              description: 'Audio file URL',
            },
          },
        },
        Cart: {
          type: 'object',
          properties: {
            cart: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  description: 'Unique cart identifier',
                },
                items: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/CartItem',
                  },
                },
              },
            },
            total: {
              type: 'number',
              description: 'Total cart amount',
            },
          },
        },
        CartItem: {
          type: 'object',
          properties: {
            count: {
              type: 'integer',
              minimum: 1,
              description: 'Item count',
            },
            product: {
              $ref: '#/components/schemas/Product',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            data: {
              type: 'null',
            },
            error: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  description: 'Error message',
                },
              },
            },
          },
        },
        Success: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              description: 'Response data',
            },
            error: {
              type: 'null',
            },
          },
        },
      },
    },
    security: [
      {
        cookieAuth: [],
      },
    ],
  },
  apis: [
    './src/controllers/*.ts',
    './src/server.ts',
  ],
};

const specs = swaggerJsdoc(options);
export default specs;
