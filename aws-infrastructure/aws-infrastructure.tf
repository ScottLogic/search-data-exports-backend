provider "aws" {
  region  = var.region
}

module "lambda" {
  source                    = "./modules/lambda"
  project                   = var.project
  environment               = var.environment
  api_gateway_execution_arn = module.api-gateway.api_gateway_execution_arn
}

module "api-gateway" {
  source                    = "./modules/api_gateway"
  region                    = var.region
  project                   = var.project
  environment               = var.environment
  search_lambda_invoke_arn  = module.lambda.search_lambda_invoke_arn
}
