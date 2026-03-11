# Cloudflare Workers Fork

This document tracks the new Cloudflare-native fork of the HeroQuest Companion app.

## Goal

Move the app from:

- EC2
- Express
- Socket.IO
- MongoDB
- Cloudflare Tunnel

to:

- Cloudflare Workers
- D1
- Durable Objects
- Cloudflare custom domain at `HQHelper.savvy-des.com`
- Terraform-managed infrastructure and deployment resources

## Current status

Implemented in this milestone:

- A separate Terraform environment at `infra/terraform/envs/workers-dev`
- A Cloudflare Worker service managed by Terraform
- A custom domain managed by Terraform: `HQHelper.savvy-des.com`
- A D1 database resource managed by Terraform
- A bootstrap Worker at `app/workers/src/index.mjs`
- An initial D1 schema draft at `app/workers/sql/001_initial_schema.sql`

Not implemented yet:

- REST API parity with the Express server
- Durable Object realtime session layer
- Frontend migration away from `socket.io-client`
- Automated schema application to D1 from Terraform
- Terraform CLI compatibility validation beyond local `terraform init`

## Milestones

1. Bootstrap Cloudflare infrastructure
2. Port persistence from MongoDB/Mongoose to D1
3. Port REST endpoints to Worker handlers
4. Port realtime session engine to Durable Objects
5. Migrate frontend transport and environment handling
6. Run multiplayer smoke validation
7. Cut traffic over to the Workers deployment

## Terraform note

Cloudflare Terraform can provision the Worker, custom domain, and D1 database directly.
Applying SQL migrations to D1 is not covered by the current Terraform resources in this repo yet,
so the schema file is staged but not wired into `terraform apply` in this milestone.

On this machine, `terraform init -backend=false` succeeded for the new environment, but
`terraform validate` failed while loading the Cloudflare provider under Terraform `1.7.5`.
Treat the Workers environment as requiring a newer Terraform CLI than the one currently installed here.

The next infrastructure step is to decide whether D1 schema application should be handled by:

- a Terraform-driven API call/provisioner workflow, or
- a Worker bootstrap endpoint invoked by Terraform.
