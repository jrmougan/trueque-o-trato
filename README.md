# Trueque o Trato

Barter marketplace built with Next.js 16 (App Router), Prisma 7 + PostgreSQL,
Auth.js (NextAuth v5) and S3-compatible image storage (MinIO in development).

## Getting Started

Tool versions are pinned in `mise.toml` (Node 24.21.0, pnpm 11.28.1 and Docker
Compose 5.5.1, used through Docker or Podman).

```bash
mise install
mise run setup          # Create .env if missing, pnpm install --frozen-lockfile, prisma generate; no DB writes
mise run services:up    # Local Postgres + MinIO (compose.dev.yaml), wait until healthy, create the bucket
mise run db:migrate     # Apply committed migrations (prisma migrate deploy)
mise run dev            # Next.js on the PORT generated in .env
mise run check          # prisma generate + ESLint + TypeScript (one pass)
mise run build          # prisma generate + production build
mise run services:down  # Stop services, keep the data volumes
```

`mise run setup` never overwrites an existing `.env`. When it creates one, it
derives a unique `COMPOSE_PROJECT_NAME`, free ports (app, Postgres, MinIO API
and console) and random secrets from the checkout path, so several clones or
git worktrees can run side by side. All services listen on `127.0.0.1` only.
`mise run services:status` shows the containers.

`compose.dev.yaml` is for local development only. The original
`docker-compose.yml` and the pnpm scripts (`pnpm dev`, `pnpm db:up`,
`pnpm db:migrate`, …) remain available and use the defaults in `.env.example`.

Open the app at the URL printed by `mise run setup` (`http://localhost:$PORT`).

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
