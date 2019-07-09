provider "aws" {
  region  = var.region
}

module "lambda" {
  source              = "./modules/lambda"
  project             = var.project
  environment         = var.environment
}

module "api-gateway" {
  source                    = "./modules/api_gateway"
  region                    = var.region
  project                   = var.project
  environment               = var.environment
  search_lambda_invoke_arn  = module.lambda.search_lambda_invoke_arn
}
