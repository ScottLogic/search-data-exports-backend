/*====
The API Gateway
======*/
resource "aws_api_gateway_rest_api" "api_gateway" {
  name        = "${var.name_prefix}-api-gateway"
  description = "${var.project} API Gateway"

  endpoint_configuration {
    types = ["EDGE"]
  }
}

resource "aws_api_gateway_resource" "search_api_resource" {
  rest_api_id = aws_api_gateway_rest_api.api_gateway.id
  parent_id = aws_api_gateway_rest_api.api_gateway.root_resource_id
  path_part = "search"
}

resource "aws_api_gateway_method" "search_api_method" {
  rest_api_id   = aws_api_gateway_rest_api.api_gateway.id
  resource_id   = aws_api_gateway_resource.search_api_resource.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "search_api_method_integration" {
  rest_api_id = aws_api_gateway_rest_api.api_gateway.id
  resource_id = aws_api_gateway_resource.search_api_resource.id
  http_method = aws_api_gateway_method.search_api_method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.search_lambda_invoke_arn
}

resource "aws_api_gateway_deployment" "deployment" {
  depends_on = [aws_api_gateway_integration.search_api_method_integration]

  rest_api_id = aws_api_gateway_rest_api.api_gateway.id
  stage_name  = var.environment
}
