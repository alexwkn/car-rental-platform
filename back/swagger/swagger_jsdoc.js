import {default as swaggerJSDoc} from "swagger-jsdoc";
import * as fs from "node:fs";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Key2Go API",
            version: "1.00.",
            description: "Designed to simplify integration, the **Key2Go API** centrally manages all aspects of a vehicle rental platform. It provides dedicated endpoints for profiles, vehicles, offers, orders, and reviews, enabling comprehensive management operations. The **JWT authentication protocol** ensures optimal data security. Its standardized structure is the key to reliable and structured exchanges, guaranteeing perfect coordination between the platform's users (renters and owners).",
            contact: {
              name: "Support Team of Key2Go",
              email: "support@key2go.com",
            },
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
