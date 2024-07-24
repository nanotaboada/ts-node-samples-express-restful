import swaggerJSDoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'ts-node-samples-express-restful',
            version: '1.0.0',
            description: '🧪 Proof of Concept for a RESTful API made with Node.js 20 (LTS), Express.js 4 in TypeScript',
        },
    },
    servers: [
        {
            url: 'http://localhost:9000',
        },
    ],
    basePath: '/',
    schemes: ['http'],
    apis: ['./src/models/*.ts', './src/controllers/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
