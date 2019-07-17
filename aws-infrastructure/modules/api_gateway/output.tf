output "api_gateway_id" {
  value = aws_api_gateway_rest_api.api_gateway.id
}

output "api_gateway_root_resource_id" {
  value = aws_api_gateway_rest_api.api_gateway.root_resource_id
}

output "api_gateway_execution_arn" {
  value = aws_api_gateway_rest_api.api_gateway.execution_arn
}

output "invoke_url" {
  value = aws_api_gateway_deployment.deployment.invoke_url
}
