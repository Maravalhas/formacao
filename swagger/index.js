let documentation;

documentation = {
  openapi: "3.0.1",
  info: {
    title: "API formação",
    version: "1.0",
  },
  produces: ["application/json"],
  schemes: ["http", "https"],
  host: "localhost:3001",
  basePath: "/",
  components: {
    schemas: {
      encomendas: {
        type: "object",
        required: ["id_categoria", "numero", "data", "observacoes", "user_id"],
        properties: {
          id: {
            type: "number",
          },
          id_categoria: {
            type: "number",
          },
          data: {
            type: "date",
          },
          observacoes: {
            type: "string",
          },
          user_id: {
            type: "number",
          },
        },
      },
      encomendas_linhas: {
        type: "object",
        required: ["id_encomenda", "artigo", "preco"],
        properties: {
          id: {
            type: "number",
          },
          id_encomenda: {
            type: "number",
          },
          artigo: {
            type: "string",
          },
          preco: {
            type: "number",
          },
        },
      },
      categorias: {
        type: "object",
        required: ["categoria"],
        properties: {
          id: {
            type: "number",
          },
          categoria: {
            type: "string",
          },
        },
      },
      users: {
        type: "object",
        required: ["email", "password", "primeiro_nome", "ultimo_nome"],
        properties: {
          id: {
            type: "number",
          },
          email: {
            type: "string",
          },
          password: {
            type: "string",
          },
          primeiro_nome: {
            type: "string",
          },
          ultimo_nome: {
            type: "string",
          },
        },
      },
    },
    securitySchemes: {
      bearer: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  paths: {
    "/auth": {
      post: {
        tags: ["Auth"],
        description: "Login with credentials",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#components/schemas/users",
              },
              examples: {
                User: {
                  value: {
                    email: "marco.marques@riopele.pt",
                    password: "123",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Access token",
          },
          401: {
            description: "Unauthorised",
          },
          403: {
            description: "Invalid values.",
          },
        },
      },
      get: {
        tags: ["Auth"],
        description: "Get user information with token",
        responses: {
          200: {
            description: "User information.",
          },
          401: {
            description: "Invalid token.",
          },
        },
        security: [
          {
            bearer: [],
          },
        ],
      },
    },
    "/orders": {
      get: {
        tags: ["Orders"],
        description: "Get all orders",
        responses: {
          200: {
            description: "Object with orders and total.",
          },
          500: {
            description: "Server error.",
          },
        },
        security: [
          {
            bearer: [],
          },
        ],
      },
      post: {
        tags: ["Orders"],
        description: "Create new order",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#components/schemas/encomendas",
              },
              examples: {
                Encomenda: {
                  value: {
                    id_categoria: 1,
                    numero: 123312,
                    observacoes: "teste",
                    linhas: [
                      {
                        artigo: "perfume",
                        preco: 40,
                      },
                      {
                        artigo: "shampoo",
                        preco: 5,
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Order created successfully.",
          },
          403: {
            description: "Invalid values.",
          },
          406: {
            description: "Duplicated order number.",
          },
          500: {
            description: "Server error.",
          },
        },
        security: [
          {
            bearer: [],
          },
        ],
      },
    },
    "/orders/{id}": {
      get: {
        tags: ["Orders"],
        description: "Get order by id",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "Order id",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          200: {
            description: "Order.",
          },
          404: {
            description: "Order not found.",
          },
          500: {
            description: "Server error.",
          },
        },
        security: [
          {
            bearer: [],
          },
        ],
      },
      put: {
        tags: ["Orders"],
        description: "Update order",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "Order id",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#components/schemas/encomendas",
              },
              examples: {
                Encomenda: {
                  value: {
                    id_categoria: 2,
                    numero: 331223,
                    observacoes: "teste",
                    linhas: [
                      {
                        artigo: "gelado",
                        preco: 2,
                      },
                      {
                        artigo: "coca cola",
                        preco: 1.5,
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Order updated successfully.",
          },
          403: {
            description: "Invalid values.",
          },
          406: {
            description: "Duplicated order number.",
          },
          500: {
            description: "Server error.",
          },
        },
        security: [
          {
            bearer: [],
          },
        ],
      },
    },
    "/categories": {
      get: {
        tags: ["Categories"],
        description: "Get all categories",
        responses: {
          200: {
            description: "List of all categories.",
          },
          500: {
            description: "Server error.",
          },
        },
        security: [
          {
            bearer: [],
          },
        ],
      },
      post: {
        tags: ["Categories"],
        description: "Create new category",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#components/schemas/categorias",
              },
              examples: {
                Category: {
                  value: {
                    categoria: "Genéricas",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Category created successfully.",
          },
          403: {
            description: "Invalid values.",
          },
          406: {
            description: "Duplicated category.",
          },
          500: {
            description: "Server error.",
          },
        },
        security: [
          {
            bearer: [],
          },
        ],
      },
    },
    "/categories/{id}": {
      put: {
        tags: ["Categories"],
        description: "Update category",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "Category id",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#components/schemas/encomendas",
              },
              examples: {
                Categoria: {
                  value: {
                    categoria: "Outro nome",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Category updated successfully.",
          },
          403: {
            description: "Invalid values.",
          },
          406: {
            description: "Duplicated category.",
          },
          500: {
            description: "Server error.",
          },
        },
        security: [
          {
            bearer: [],
          },
        ],
      },
    },
  },
};

module.exports = documentation;
