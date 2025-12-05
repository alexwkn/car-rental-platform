import {default as swaggerJSDoc} from "swagger-jsdoc";
import * as fs from "node:fs";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Key2Go API",
            version: "1.00.",
            description: "The **Key2Go API** centralizes all features required for a complete vehicle rental platform. It provides endpoints for managing user profiles, vehicles, rental offers, orders, favorites, and reviews. Authentication relies on secure **JWT tokens** to protect every request. Its standardized structure ensures predictable, reliable, and efficient communication between renters and owners.",
            contact: {
                name: "Support Team of Key2Go",
                email: "support@key2go.com"
            }
        },

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        }
    },

    apis: [
        "./API/controler/**/*.js",
        "./API/middleware/**/*.js",
        "./API/model/**/*.js",
        "./API/routes/**/*.js",
    ],
};

const swaggerSpec = swaggerJSDoc(options);
fs.writeFileSync("./swagger/spec.json", JSON.stringify(swaggerSpec));
