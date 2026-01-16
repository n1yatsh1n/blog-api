import { Express } from "express";
import swaggerUi from "swagger-ui-express";

export function setupSwaggerUsers(app: Express) {
  const spec = {
    openapi: "3.0.0",
    info: {
      title: "Users Service API — Lab 2",
      version: "2.0.0",
      description: "User registration, login and profile management.",
    },
    servers: [{ url: "/" }],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "integer" },
            email: { type: "string" },
            username: { type: "string" },
            bio: { type: "string", nullable: true },
            image_url: { type: "string", nullable: true },
            createdAt: { type: "string" },
          },
        },
        UserAuthResponse: {
          type: "object",
          properties: {
            user: {
              type: "object",
              properties: {
                id: { type: "integer" },
                email: { type: "string" },
                username: { type: "string" },
                token: { type: "string" },
              },
            },
          },
        },
      },
    },

    paths: {
      "/api/users": {
        post: {
          summary: "Register user",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "username", "password"],
                  properties: {
                    email: { type: "string" },
                    username: { type: "string" },
                    password: { type: "string" },
                    bio: { type: "string" },
                    image_url: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            "201": { description: "Created" },
          },
        },
      },

      "/api/users/login": {
        post: {
          summary: "Login",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    email: { type: "string" },
                    password: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            "200": { description: "OK" },
          },
        },
      },

      "/api/user": {
        get: {
          summary: "Get current user",
          security: [{ bearerAuth: [] }],
          responses: { "200": { description: "OK" } },
        },

        put: {
          summary: "Update current user",
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    email: { type: "string" },
                    username: { type: "string" },
                    password: { type: "string" },
                    bio: { type: "string" },
                    image_url: { type: "string" },
                  },
                },
              },
            },
          },
          responses: { "200": { description: "OK" } },
        },
      },
    },
  };

  app.use("/api/users/docs", swaggerUi.serve, swaggerUi.setup(spec, { explorer: true }));
}
