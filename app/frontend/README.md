# Aerohealth frontend

The Next.js frontend connects to the Aerohealth FastAPI service. The homepage reads engine histories, model estimates, sensor trajectories, research metrics, and methodology from the API.

## Local development

1. Start the API from the repository root using the instructions in [the API README](../backend/README.md).
2. Copy `.env.example` to `.env.local` if you want to set a custom API URL. The default is `http://localhost:8000`.
3. Install dependencies and start the frontend:

~~~bash
npm install
npm run dev
~~~

Open http://localhost:3000. The API must allow the frontend origin through `AEROHEALTH_ALLOWED_ORIGINS`.

## Deployment

Set `NEXT_PUBLIC_AEROHEALTH_API_URL` to the public API base URL when building the frontend. This is a browser-visible setting, not a secret. Set `AEROHEALTH_ALLOWED_ORIGINS` on the API to the exact deployed frontend origin or origins, and set `AEROHEALTH_ENVIRONMENT=production`. The backend rejects wildcard CORS origins and requires an explicit production origin list. Deploy the API and the frontend as separate services.

## Checks

~~~bash
npm run lint
npx tsc --noEmit
npm run build
~~~
