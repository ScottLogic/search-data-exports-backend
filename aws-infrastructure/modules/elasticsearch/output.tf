output "endpoint" {
  value = "https://${aws_elasticsearch_domain.test-domain.endpoint}"
}

output "kibana_endpoint" {
  value = "https://${aws_elasticsearch_domain.test-domain.kibana_endpoint}"
}
