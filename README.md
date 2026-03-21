# PT-Maja Frontend — Angular

Frontend del blog PT-Maja construido con Angular 18 y standalone components.

## Configuracion del archivo `.env`

Antes de levantar cualquier servicio crea el archivo `.env` en este directorio con el siguiente contenido:

```env
# Frontend
FRONTEND_PORT=4200
# Si el backend corre localmente:
API_BASE_URL=http://localhost:3000/api
# Si el backend esta desplegado en Railway u otro servicio:
# API_BASE_URL=https://your-backend.up.railway.app/api
```

O copia el archivo de ejemplo:

```bash
cp .env.example .env
```

## Stack

| Tecnologia | Version |
| --- | --- |
| Angular | 18 |
| TypeScript | 5 |
| RxJS | 7 |

## Requisitos

- **Docker** y **Docker Compose** instalados
- Puerto `4200` disponible
- El backend debe estar corriendo en `http://localhost:3000`

## Inicio rapido

### 1. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` si el backend corre en una URL diferente.

| Variable | Descripcion | Default |
| --- | --- | --- |
| `FRONTEND_PORT` | Puerto del servidor de desarrollo | `4200` |
| `API_BASE_URL` | URL base de la API del backend | `http://localhost:3000/api` |

### 2. Levantar el servicio

```bash
docker compose up --build
```

| Servicio | Puerto | Descripcion |
| --- | --- | --- |
| `ptmaja-web` | 4200 | Frontend (Angular) |

### 3. Acceder

- **Frontend:** http://localhost:4200

## Funcionalidades

- **Autenticacion:** Registro e inicio de sesion con JWT. Las rutas protegidas redirigen al login.
- **Posts:** Crear, editar, eliminar y listar posts. Soporte para imagenes via Cloudinary.
- **Busqueda y filtros:** Busqueda por titulo con debounce, filtro por estado (publicado/borrador) y por categoria.
- **Comentarios:** Crear, editar y eliminar comentarios en cada post.
- **Categorias (admin):** Gestion completa de categorias, solo accesible para usuarios con rol `admin`.
- **Paginacion:** Navegacion por paginas en el listado de posts.

## Rutas

| Ruta | Componente | Auth | Descripcion |
| --- | --- | --- | --- |
| `/login` | LoginComponent | No | Inicio de sesion |
| `/register` | RegisterComponent | No | Registro de usuario |
| `/` | PostListComponent | Si | Listado de posts con filtros |
| `/posts/new` | PostFormComponent | Si | Crear nuevo post |
| `/posts/:id` | PostDetailComponent | Si | Detalle de un post con comentarios |
| `/posts/:id/edit` | PostFormComponent | Si | Editar un post existente |
| `/categories` | CategoriesAdminComponent | Si | Gestion de categorias (admin) |

> Las rutas marcadas con **Auth** requieren iniciar sesion. Si el usuario no esta autenticado, sera redirigido a `/login`.

## Estructura del proyecto

```
src/
  main.ts                              # Bootstrap de la aplicacion
  index.html                           # HTML principal
  styles.css                           # Estilos globales y variables CSS
  environments/
    environment.ts                     # Configuracion de entorno (API URL)
  app/
    app.component.ts                   # Componente raiz (navbar + router-outlet)
    app.config.ts                      # Configuracion de providers
    app.routes.ts                      # Definicion de rutas
    core/
      guards/
        auth.guard.ts                  # Guard de autenticacion
      interceptors/
        auth.interceptor.ts            # Interceptor para agregar JWT a requests
      services/
        api.service.ts                 # Servicio base HTTP
        auth.service.ts                # Login, registro, manejo de token
        categories.service.ts          # CRUD de categorias
        comments.service.ts            # CRUD de comentarios
        posts.service.ts               # CRUD de posts
    features/
      auth/
        login.component.ts            # Formulario de login
        register.component.ts          # Formulario de registro
      categories/
        categories-admin.component.ts  # Gestion de categorias
      comments/
        comment-form.component.ts      # Formulario de comentarios
      posts/
        post-detail.component.ts       # Detalle de post + comentarios
        post-form.component.ts         # Crear/editar post
        post-list.component.ts         # Listado con filtros y paginacion
```

## Desarrollo local (sin Docker)

```bash
npm install
npm run start
```

Asegurate de que el backend este corriendo en `http://localhost:3000`.

## Scripts

| Script | Descripcion |
| --- | --- |
| `npm run start` | Inicia servidor de desarrollo |
| `npm run build` | Compila para produccion |
| `npm test` | Ejecuta tests |
