output "worker_url" {
  description = "Primary URL for the Cloudflare Workers deployment."
  value       = "https://${local.worker_hostname}"
}

output "worker_name" {
  description = "Cloudflare Worker service name."
  value       = cloudflare_worker.hq_helper.name
}

output "d1_database_id" {
  description = "D1 database ID for the Workers fork."
  value       = cloudflare_d1_database.hq_helper.id
}

output "d1_database_name" {
  description = "D1 database name for the Workers fork."
  value       = cloudflare_d1_database.hq_helper.name
}
