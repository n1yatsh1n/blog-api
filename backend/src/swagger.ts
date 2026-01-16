import { Express } from "express";
import swaggerUi from "swagger-ui-express";

export function setupSwagger(app: Express) {
  const spec = {
    openapi: "3.0.0",
    info: {
      title: "Blog API — Lab 1",
      version: "1.0.0",
      description:
        "RESTful API for a simplified blog platform (Node.js + Express + Sequelize).",
    },
    servers: [{ url: "/" }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
      schemas: {
        UserAuth: {
          type: "object",
          properties: {
            email: { type: "string", example: "alice@example.com" },
            username: { type: "string", example: "alice" },
            bio: { type: "string", nullable: true },
            image_url: { type: "string", nullable: true },
            token: { type: "string" },
          },
        },
        Article: {
          type: "object",
          properties: {
            slug: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            body: { type: "string" },
            tagList: { type: "array", items: { type: "string" } },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            author: {
              type: "object",
              properties: {
                username: { type: "string" },
                bio: { type: "string", nullable: true },
                image_url: { type: "string", nullable: true },
              },
            },
          },
        },
        Comment: {
          type: "object",
          properties: {
            id: { type: "integer" },
            body: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            author: {
              type: "object",
              properties: {
                username: { type: "string" },
                bio: { type: "string", nullable: true },
                image_url: { type: "string", nullable: true },
              },
            },
          },
        },
      },
    },
    paths: {
      "/api/articles": {
        get: {
          summary: "List articles",
          parameters: [
            { in: "query", name: "limit", schema: { type: "integer" } },
            { in: "query", name: "offset", schema: { type: "integer" } },
          ],
          responses: { "200": { description: "OK" } },
        },
        post: {
          summary: "Create article",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                    body: { type: "string" },
                    tagList: { type: "array", items: { type: "string" } },
                  },
                  required: ["title", "description", "body"],
                },
              },
            },
          },
          responses: {
            "201": { description: "Created" },
            "401": { description: "Unauthorized" },
          },
        },
      },
      "/api/articles/{slug}": {
        get: {
          summary: "Get article by slug",
          parameters: [
            {
              in: "path",
              name: "slug",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": { description: "OK" },
            "404": { description: "Not Found" },
          },
        },
        put: {
          summary: "Update article",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "slug",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                    body: { type: "string" },
                    tagList: { type: "array", items: { type: "string" } },
                  },
                },
              },
            },
          },
          responses: {
            "200": { description: "OK" },
            "401": { description: "Unauthorized" },
            "403": { description: "Forbidden" },
          },
        },
        delete: {
          summary: "Delete article",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "slug",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            "204": { description: "No Content" },
            "401": { description: "Unauthorized" },
            "403": { description: "Forbidden" },
          },
        },
      },
      "/api/articles/{slug}/comments": {
        get: {
          summary: "List comments",
          parameters: [
            {
              in: "path",
              name: "slug",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: { "200": { description: "OK" } },
        },
        post: {
          summary: "Add comment",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "slug",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { body: { type: "string" } },
                  required: ["body"],
                },
              },
            },
          },
          responses: {
            "201": { description: "Created" },
            "401": { description: "Unauthorized" },
          },
        },
      },
      "/api/articles/{slug}/comments/{id}": {
        delete: {
          summary: "Delete comment",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "slug",
              required: true,
              schema: { type: "string" },
            },
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            "204": { description: "No Content" },
            "401": { description: "Unauthorized" },
            "403": { description: "Forbidden" },
          },
        },
      },
    },
  };
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(spec, { explorer: true }));
}
