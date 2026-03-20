# PT-Maja Frontend — Angular

Frontend del blog PT-Maja con Angular 18 (standalone components).

## Stack

| Tecnologia | Version |
| --- | --- |
| Angular | 18 |
| TypeScript | 5 |
| RxJS | 7 |

## Requisitos

- **Docker** y **Docker Compose** instalados
- Puerto `4200` disponible
- El backend debe estar corriendo en `http://localhost:3000` (o configurar `API_BASE_URL`)

## Inicio rapido

### 1. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` si el backend corre en una URL diferente.

### 2. Levantar el servicio

```bash
docker compose up --build
```

| Servicio | Puerto | Descripcion |
| --- | --- | --- |
| `ptmaja-web` | 4200 | Frontend (Angular) |

### 3. Acceder

- **Frontend:** http://localhost:4200

## Desarrollo local (sin Docker)

```bash
npm install
npm run start
```

## Scripts

| Script | Descripcion |
| --- | --- |
| `npm run start` | Inicia servidor de desarrollo |
| `npm run build` | Compila para produccion |
| `npm test` | Ejecuta tests |

## Configuracion

La URL del API se configura en:
- `src/environments/environment.ts` (desarrollo local)
- Variable de entorno `API_BASE_URL` (Docker)
