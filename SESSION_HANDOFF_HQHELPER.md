# HQHelper Session Handoff

Use this file at the start of a new Codex session to continue the Cloudflare Workers migration.

## Project identity

- Original repo: `Vibing101/HQ_Companioon_V5`
- New fork repo: `Vibing101/HQHelper`
- New production target URL: `HQHelper.savvy-des.com`

## Important constraints

- All infrastructure and deployment must be handled through Terraform.
- The Cloudflare version must be developed in the new `HQHelper` repo, not the original repo.
- The existing AWS/EC2/Tunnel deployment must remain untouched unless explicitly asked.

## What was already done

### GitHub repo separation

- Created a fork of the original repo.
- Renamed the fork to `HQHelper`.
- Transferred the fork into the `Vibing101` GitHub organization.
- Updated local git remotes:
  - `origin` -> `https://github.com/Vibing101/HQHelper.git`
  - `upstream` -> `https://github.com/Vibing101/HQ_Companioon_V5.git`

### Cloudflare Workers bootstrap

Added a new Terraform environment for the Workers stack:

- [infra/terraform/envs/workers-dev/main.tf](/Users/kyriakossavvides/Documents/GitHub/HQ_Companioon_V5/infra/terraform/envs/workers-dev/main.tf)
- [infra/terraform/envs/workers-dev/variables.tf](/Users/kyriakossavvides/Documents/GitHub/HQ_Companioon_V5/infra/terraform/envs/workers-dev/variables.tf)
- [infra/terraform/envs/workers-dev/versions.tf](/Users/kyriakossavvides/Documents/GitHub/HQ_Companioon_V5/infra/terraform/envs/workers-dev/versions.tf)
- [infra/terraform/envs/workers-dev/outputs.tf](/Users/kyriakossavvides/Documents/GitHub/HQ_Companioon_V5/infra/terraform/envs/workers-dev/outputs.tf)
- [infra/terraform/envs/workers-dev/terraform.tfvars.example](/Users/kyriakossavvides/Documents/GitHub/HQ_Companioon_V5/infra/terraform/envs/workers-dev/terraform.tfvars.example)
- [infra/terraform/envs/workers-dev/backend.hcl](/Users/kyriakossavvides/Documents/GitHub/HQ_Companioon_V5/infra/terraform/envs/workers-dev/backend.hcl)

This new environment is intended to manage:

- Cloudflare Worker service
- Cloudflare custom domain for `HQHelper.savvy-des.com`
- Cloudflare D1 database

### Worker app bootstrap

Added a minimal Worker entrypoint:

- [app/workers/src/index.mjs](/Users/kyriakossavvides/Documents/GitHub/HQ_Companioon_V5/app/workers/src/index.mjs)

Current behavior:

- returns a bootstrap HTML page at `/`
- exposes `/api/health`
- exposes `/api/meta`
- tests D1 connectivity with `SELECT 1`

### D1 schema draft

Added an initial schema draft:

- [app/workers/sql/001_initial_schema.sql](/Users/kyriakossavvides/Documents/GitHub/HQ_Companioon_V5/app/workers/sql/001_initial_schema.sql)

Current draft covers:

- campaigns
- parties
- quest_log
- heroes
- sessions

### Migration notes

Added migration status doc:

- [docs/architecture/CLOUDFLARE_WORKERS_FORK.md](/Users/kyriakossavvides/Documents/GitHub/HQ_Companioon_V5/docs/architecture/CLOUDFLARE_WORKERS_FORK.md)

## Current status assessment

The Cloudflare fork is only bootstrapped. It is not production-ready.

Implemented:

- repo split from original
- Terraform scaffold for Workers stack
- bootstrap Worker
- initial D1 schema draft

Not implemented:

- Express API migration
- MongoDB to D1 repository layer
- Durable Objects realtime layer
- frontend migration away from Socket.IO
- Terraform-driven schema application to D1
- production apply/cutover

## Known issues / blockers

### Terraform validation issue on local machine

`terraform init -backend=false` succeeded in `infra/terraform/envs/workers-dev`, but `terraform validate` failed locally because the installed Terraform CLI is `1.7.5` and the Cloudflare provider hit a protocol/schema loading issue.

This means:

- the config was formatted and initialized locally
- full provider-backed validation was not completed on this machine
- next session should verify Terraform CLI/provider compatibility before first real apply

## Architecture decisions already made

- Cloudflare target stack:
  - Workers
  - D1
  - Durable Objects
- Realtime should be rebuilt natively for Workers, not lifted directly from Socket.IO.
- This is a fork/replatform, not an in-place deployment change.
- Cost expectation for the user’s small workload is roughly `$5/month`.

## Recommended next steps

Completed on 2026-03-11:
- Verified this checkout is the forked repo.
- Confirmed `origin` is `https://github.com/Vibing101/HQHelper.git`.
- Confirmed `upstream` is `https://github.com/Vibing101/HQ_Companioon_V5.git`.

1. Confirm or upgrade Terraform CLI compatibility for the Cloudflare provider.
2. Review and correct any Terraform resource schema issues in `infra/terraform/envs/workers-dev`.
3. Decide how D1 schema application will be handled through Terraform.
4. Port the REST API first:
   - campaigns
   - join flow
   - heroes
   - sessions
5. After REST parity, rebuild realtime with Durable Objects and native WebSockets.
6. Update the frontend to use the Worker API and new realtime transport.

## Suggested prompt for the next Codex session

Use this exact context:

```text
We are continuing work on the Cloudflare Workers fork of this project.

Important context:
- The active repo is the fork: Vibing101/HQHelper
- The original repo is Vibing101/HQ_Companioon_V5 and should not receive new changes
- The new deployment target is HQHelper.savvy-des.com
- All infrastructure and deployment must be handled through Terraform
- A bootstrap Workers environment already exists under infra/terraform/envs/workers-dev
- A bootstrap Worker exists at app/workers/src/index.mjs
- A draft D1 schema exists at app/workers/sql/001_initial_schema.sql
- docs/architecture/CLOUDFLARE_WORKERS_FORK.md contains the migration status
- terraform init worked locally, but terraform validate failed because of local Terraform/provider compatibility

Your first step is to inspect the current fork state, verify the Terraform Workers environment, and continue the migration from the current bootstrap state without touching the legacy AWS deployment.
```

## Final reminder

Do not resume from the old AWS deployment files as the main target. Those remain reference material only. The active migration target is the new Cloudflare Workers fork in `Vibing101/HQHelper`.
