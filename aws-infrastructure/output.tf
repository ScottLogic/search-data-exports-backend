output "api_gateway_invoke_url" {
  value = module.api-gateway.invoke_url
}

output "elasticsearch_endpoint" {
  value = module.elasticserch.endpoint
}

output "elasticsearch_kibana_endpoint" {
  value = module.elasticserch.kibana_endpoint
}
