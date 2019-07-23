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

resource "aws_api_gateway_deployment" "deployment" {
  rest_api_id = aws_api_gateway_rest_api.api_gateway.id
  stage_name  = var.environment
  # Force the stage deployment should any resources (endpoints) change and force a dependency on them
  depends_on = [var.api_method_integration_ids]
}
