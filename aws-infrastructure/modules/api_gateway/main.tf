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

  # this is used as a "taint", to force the stage deployment should any resources (endpoints) change and force a dependency on them
  stage_description = "Deployment of ${length(var.api_resource_ids)} resources"
}
