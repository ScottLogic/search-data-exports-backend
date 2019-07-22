resource "aws_api_gateway_resource" "api_resource" {
  rest_api_id = var.api_gateway_id
  parent_id   = var.api_gateway_parent_id
  path_part   = var.api_name
}

resource "aws_api_gateway_method" "api_method" {
  rest_api_id   = var.api_gateway_id
  resource_id   = aws_api_gateway_resource.api_resource.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "lambda_api_method_integration" {
  rest_api_id             = var.api_gateway_id
  resource_id             = aws_api_gateway_resource.api_resource.id
  http_method             = aws_api_gateway_method.api_method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_invoke_arn
}

module "cors" {
  source = "./cors"

  api_id          = var.api_gateway_id
  api_resource_id = aws_api_gateway_resource.api_resource.id
}
