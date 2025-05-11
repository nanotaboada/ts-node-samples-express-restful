import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import type { SwaggerUiOptions } from 'swagger-ui-express';

const envPath = process.env.NODE_ENV === 'development' ? 'src' : 'dist';

/**
 * Swagger configuration for generating API documentation.
 *
 * This module sets up the Swagger documentation for the RESTful API.
 * It uses the `swagger-jsdoc` library to generate the Swagger specification based on the provided options.
 *
 * @module swaggerSpec
 * @requires swagger-jsdoc
 *
 * @example
 * import swaggerSpec from './path/to/this/module';
 *
 * // Use swaggerSpec in your Express app setup
 * app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
 *
 * @see {@link https://swagger.io/tools/swagger-ui/} for Swagger UI documentation.
 * @see {@link https://github.com/Surnet/swagger-jsdoc} for `swagger-jsdoc` documentation.
 */
const swaggerJSDocOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'ts-node-samples-express-restful',
            version: '1.0.0',
            description: '🧪 Proof of Concept for a RESTful API made with Node.js 20 (LTS), Express.js 4 in TypeScript',
        },
        components: {
            schemas: {
                Player: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'The unique identifier for the Player',
                        },
                        firstName: {
                            type: 'string',
                            description: 'The first name of the Player',
                        },
                        middleName: {
                            type: 'string',
                            nullable: true,
                            description: 'The middle name of the Player',
                        },
                        lastName: {
                            type: 'string',
                            description: 'The last name of the Player',
                        },
                        dateOfBirth: {
                            type: 'string',
                            format: 'date',
                            description: 'The date of birth of the Player',
                        },
                        squadNumber: {
                            type: 'integer',
                            description: 'The unique squad number assigned to the Player',
                        },
                        position: {
                            type: 'string',
                            description: 'The playing position of the Player',
                        },
                        abbrPosition: {
                            type: 'string',
                            description: "The abbreviated form of the Player's position",
                        },
                        team: {
                            type: 'string',
                            description: 'The team to which the Player belongs',
                        },
                        league: {
                            type: 'string',
                            description: 'The league where the team plays',
                        },
                        starting11: {
                            type: 'boolean',
                            description: 'Indicates if the Player is in the starting 11',
                        },
                    },
                    example: {
                        id: 10,
                        firstName: 'Lionel',
                        middleName: 'Andrés',
                        lastName: 'Messi',
                        dateOfBirth: '1987-06-24',
                        squadNumber: 10,
                        position: 'Right Winger',
                        abbrPosition: 'RW',
                        team: 'Inter Miami CF',
                        league: 'Major League Soccer',
                        starting11: true,
                    },
                },
            },
        },
    },
    servers: [
        {
            url: 'http://localhost:9000',
        },
    ],
    basePath: '/',
    schemes: ['http'],
    apis: process.env.NODE_ENV === 'development' ? ['./src/controllers/*.ts'] : ['./dist/controllers/*.js'],
};

const validatedSwaggerSpecJSON = swaggerJSDoc(swaggerJSDocOptions);

// Swagger UI Configuration
const customSwaggerUiOptions: SwaggerUiOptions = {
    customSiteTitle: '🧪 RESTful API with Node.js and Express.js in TypeScript',
    swaggerOptions: {
        validatorUrl: null, // Disable external validator
        defaultModelsExpandDepth: -1, // Hide schemas by default
        tryItOutEnabled: true, // Enable "Try it out" by default
        displayRequestDuration: true,
        docExpansion: 'list',
    },
};

export { validatedSwaggerSpecJSON as swaggerSpec, swaggerUiExpress as swaggerUi, customSwaggerUiOptions as swaggerUiOptions };
