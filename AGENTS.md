<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Development environment

Tool versions are pinned in `mise.toml` (Node 24.21.0, pnpm 11.28.1). Use the mise tasks:

```bash
mise install
mise run setup          # Create .env only if missing (per-worktree ports/secrets), pnpm install --frozen-lockfile, prisma generate; no DB writes
mise run services:up    # Postgres + MinIO from compose.dev.yaml (local only), create the bucket
mise run db:migrate     # prisma migrate deploy (explicit step)
mise run dev            # Next.js on the PORT from .env
mise run check          # prisma generate + lint + typecheck
mise run build          # prisma generate + next build
mise run services:down  # Keep data volumes
```

Each worktree runs `setup` independently and gets its own `.env`, Compose project,
ports and volumes. Never commit `.env`. There are no automated tests yet.
