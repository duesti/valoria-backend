// src/core/docs.ts
import { Hono } from "hono";

const docsRouter = new Hono();

// Serve OpenAPI JSON
docsRouter.get("/openapi.json", async (ctx) => {
	const openapi = await import("../../openapi.json");
	return ctx.json(openapi);
});

// Serve Swagger UI HTML
docsRouter.get("/docs", (ctx) => {
	return ctx.html(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Valoria API Docs</title>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@4/swagger-ui.css">
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="https://unpkg.com/swagger-ui-dist@4/swagger-ui-bundle.js"></script>
        <script src="https://unpkg.com/swagger-ui-dist@4/swagger-ui-standalone-preset.js"></script>
        <script>
          SwaggerUIBundle({
            url: "/openapi.json",
            dom_id: "#swagger-ui",
            presets: [
              SwaggerUIBundle.presets.apis,
              SwaggerUIStandalonePreset
            ],
            layout: "StandaloneLayout"
          })
        </script>
      </body>
    </html>
  `);
});

// Serve ReDoc UI (альтернатива)
docsRouter.get("/redoc", (ctx) => {
	return ctx.html(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Valoria API Docs - ReDoc</title>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet">
        <style>
          body {
            margin: 0;
            padding: 0;
          }
        </style>
      </head>
      <body>
        <redoc spec-url="/openapi.json"></redoc>
        <script src="https://cdn.jsdelivr.net/npm/redoc@next/bundles/redoc.standalone.js"></script>
      </body>
    </html>
  `);
});

export { docsRouter };
