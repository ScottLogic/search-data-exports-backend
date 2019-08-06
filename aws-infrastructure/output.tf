output "elasticsearch_endpoint" {
  value = module.elasticsearch.endpoint
}

output "elasticsearch_kibana_endpoint" {
  value = module.elasticsearch.kibana_endpoint
}

output "site_domain_name" {
  value = module.s3-bucket-site.cdn_domain_name
}
