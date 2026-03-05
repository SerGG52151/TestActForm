# Practica desde cero: React + TypeScript consumiendo una API local

Esta practica esta pensada para una clase de 2 horas.

## Objetivo
Construir una app llamada **Explorador de publicaciones** que:

- consuma una API con `fetch`
- use `async/await`
- cargue publicaciones con `useEffect`
- filtre resultados con un input controlado
- cargue comentarios del post seleccionado

## Backend incluido para la clase

El proyecto incluye un backend local con `json-server` y persistencia en `db.json`.

- Base URL: `http://localhost:3001`
- Recursos: `posts`, `comments`

Endpoints disponibles:

- `GET /posts`
- `GET /posts/:id`
- `POST /posts`
- `PUT /posts/:id`
- `PATCH /posts/:id`
- `DELETE /posts/:id`
- `GET /posts/:id/comments`
- `GET /comments?postId=:id`

## Como ejecutar

```bash
npm install
npm run api
```

En otra terminal:

```bash
npm run dev
```

O ambos a la vez:

```bash
npm run start:all
```

## Estructura del proyecto

- `db.json`: datos persistentes del backend local
- `src/lib/api.ts`: funciones para consumir la API
- `src/hooks/usePosts.ts`: carga y filtra posts
- `src/hooks/useComments.ts`: carga comentarios del post seleccionado
- `src/components/`: UI separada por responsabilidad

## Archivos de apoyo para clase

- `GUIA-ESTUDIANTE.md`
