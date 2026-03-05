# Guia paso a paso para estudiantes - Refactor a CRUD

## Contexto del ejercicio

En esta version de la practica ya tienes un backend local listo.
No vas a programar backend. Tu objetivo es practicar React consumiendo una API y operando datos con CRUD completo.

- C: Create (crear)
- R: Read (leer)
- U: Update (editar)
- D: Delete (eliminar)

## 0) Preparacion del entorno

1. Instala dependencias:

```bash
npm install
```

2. Levanta la API local:

```bash
npm run api
```

3. En otra terminal, levanta React:

```bash
npm run dev
```

Tambien puedes ejecutar ambos con:

```bash
npm run start:all
```

Explicacion:
- `json-server` guarda cambios en `db.json`.
- Cada alta, edicion o eliminacion se persiste en ese archivo.
- Asi puedes practicar flujo real de frontend sin una base de datos real.

## 1) Entender el estado actual del proyecto

Antes de refactorizar, identifica lo que ya existe:

- `src/lib/api.ts`: llamadas HTTP actuales
- `src/hooks/usePosts.ts`: carga y filtro de publicaciones
- `src/hooks/useComments.ts`: carga comentarios por `postId`
- `src/components/PostList.tsx`, `PostDetail.tsx`, `SearchBar.tsx`

Explicacion:
- El proyecto ya tiene la parte R (lectura) parcialmente resuelta.
- Tu trabajo es extenderlo a CRUD sin romper lo que ya funciona.

## 2) Extender la capa de API (`src/lib/api.ts`)

Agrega funciones para operaciones de escritura:

- `createPost(payload)` -> `POST /posts`
- `updatePost(id, payload)` -> `PUT /posts/:id` o `PATCH /posts/:id`
- `deletePost(id)` -> `DELETE /posts/:id`

Recomendacion de tipos:

- `type PostInput = { title: string; body: string; userId: number }`

Explicacion:
- Mantener todo acceso HTTP en un solo archivo evita duplicacion.
- Si luego cambia la API, solo actualizas esta capa.

## 3) Refactor del hook de publicaciones (`src/hooks/usePosts.ts`)

El hook debe pasar de "solo lectura" a "estado + mutaciones".

Estado minimo sugerido:

- `posts`
- `filteredPosts`
- `loading`
- `error`
- `saving` (opcional, para create/update/delete)

Funciones que debe exponer:

- `reloadPosts()`
- `createNewPost(input)`
- `editPost(id, input)`
- `removePost(id)`

Explicacion:
- El hook concentra la logica de negocio y la UI queda mas simple.
- La UI solo dispara acciones; el hook decide como actualizar estado.

## 4) Crear formulario reutilizable (`PostForm`)

Crea un componente, por ejemplo `src/components/PostForm.tsx`, que sirva para:

- crear post
- editar post

Props sugeridas:

- `initialValues`
- `onSubmit`
- `submitLabel`
- `loading`

Explicacion:
- Un mismo formulario para crear y editar reduce codigo repetido.
- Practicas formularios controlados y validacion basica.

## 5) Integrar Create (alta)

Desde `App.tsx` (o donde centralices acciones):

1. Renderiza `PostForm` en modo creacion.
2. Al enviar, llama `createNewPost`.
3. Refresca lista o actualiza estado local.

Validacion minima:

- `title` obligatorio
- `body` obligatorio

Explicacion:
- Este paso te enseña el ciclo completo: formulario -> API -> estado -> render.

## 6) Integrar Update (edicion)

Agrega accion de editar en cada tarjeta o en el detalle del post.

Flujo sugerido:

1. Seleccionas un post.
2. Abres `PostForm` con valores iniciales.
3. Enviar llama `editPost(post.id, data)`.
4. Actualizas lista y detalle.

Explicacion:
- Editar obliga a sincronizar bien el estado para que UI y datos no diverjan.

## 7) Integrar Delete (eliminacion)

Agrega boton "Eliminar" por post.

Flujo sugerido:

1. Confirmar intencion (`window.confirm` es suficiente en esta practica).
2. Llamar `removePost(id)`.
3. Si el post eliminado estaba seleccionado, limpiar seleccion.

Explicacion:
- Aqui practicas estados derivados y consistencia de interfaz tras borrar.

## 8) Estados de UX que debes cuidar

Para cada operacion, muestra feedback:

- carga inicial: "Cargando publicaciones..."
- error de red/API: mensaje visible
- guardando cambios: deshabilitar botones/form
- lista vacia: estado vacio claro

Explicacion:
- Una app funcional no solo "hace fetch"; tambien comunica que esta pasando.

## 9) Objetivo tecnico del refactor

Al terminar, debes poder demostrar:

1. `GET` para listar y detalle.
2. `POST` para crear.
3. `PATCH` o `PUT` para editar.
4. `DELETE` para eliminar.
5. Actualizacion visual inmediata sin recargar el navegador manualmente.

## 10) Checklist de terminado

- [ ] Puedo crear una publicacion y verla en la lista.
- [ ] Puedo editar una publicacion y ver cambios en UI.
- [ ] Puedo eliminar una publicacion y desaparece de UI.
- [ ] Si recargo la app, los cambios persisten porque quedaron en `db.json`.
- [ ] Manejo estados de loading y error en todas las operaciones.

## 11) Retos opcionales (si terminas antes)

1. Agregar buscador por titulo y por contenido.
2. Crear comentarios para el post seleccionado (`POST /comments`).
3. Implementar "actualizacion optimista" al eliminar.
4. Separar mutaciones en un hook propio (`usePostMutations`).

## Nota final

El foco de esta practica es React y consumo de API.
No necesitas optimizar backend, autenticacion, ni arquitectura avanzada de servidor.
Tu criterio de exito es: claridad en componentes, buen manejo de estado y flujo CRUD correcto.
